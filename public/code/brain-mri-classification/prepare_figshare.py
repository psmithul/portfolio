import argparse
from collections import Counter, defaultdict
from contextlib import ExitStack
from hashlib import md5
from io import BytesIO
import json
from pathlib import Path
from random import Random
from shutil import copyfileobj
from tempfile import TemporaryDirectory
from time import time_ns
from urllib.request import urlopen
from zipfile import ZipFile

import h5py
import numpy as np
from PIL import Image


LABELS = {1: "meningioma", 2: "glioma", 3: "pituitary_tumor"}
ARCHIVES = (
    ("brainTumorDataPublic_1-766.zip", 3381290, "74b949ad33f042e6e103523091cd1428"),
    ("brainTumorDataPublic_767-1532.zip", 3381296, "7e8a875500d2c8a346f270538e29890e"),
    ("brainTumorDataPublic_1533-2298.zip", 3381293, "8227bf6080cb71f15a88be8d25c79ae7"),
    ("brainTumorDataPublic_2299-3064.zip", 3381302, "b378a80d6174e5317d59eb28430c6652"),
)
DOI = "https://doi.org/10.6084/m9.figshare.1512427.v5"


def checksum(path):
    digest = md5()
    with path.open("rb") as file:
        for block in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def download_archives(cache):
    cache.mkdir(parents=True, exist_ok=True)
    paths = []
    for name, file_id, expected in ARCHIVES:
        path = cache / name
        if not path.is_file() or checksum(path) != expected:
            temp = path.with_suffix(".part")
            url = f"https://ndownloader.figshare.com/files/{file_id}?download={time_ns()}"
            print(f"Downloading {name}", flush=True)
            try:
                with urlopen(url, timeout=90) as response, temp.open("wb") as file:
                    copyfileobj(response, file, length=1024 * 1024)
                if checksum(temp) != expected:
                    raise ValueError(f"Checksum did not match for {name}.")
                temp.replace(path)
            finally:
                temp.unlink(missing_ok=True)
        paths.append(path)
    return paths


def read_metadata(archives):
    records = []
    patients = defaultdict(set)
    for archive in archives:
        names = sorted(archive.namelist(), key=lambda name: int(Path(name).stem))
        for name in names:
            with h5py.File(BytesIO(archive.read(name)), "r") as file:
                data = file["cjdata"]
                patient = "".join(chr(int(code)) for code in data["PID"][:].ravel()).strip()
                label = LABELS[int(data["label"][0, 0])]
            if not patient:
                raise ValueError(f"Missing patient identifier in {name}.")
            patients[patient].add(label)
            records.append((archive, name, patient, label))
    if len(records) != 3064 or len(patients) != 233:
        raise ValueError("The archives do not match the expected slice and patient counts.")
    return records, patients


def split_patients(patients):
    by_label = defaultdict(list)
    for patient, labels in patients.items():
        if len(labels) != 1:
            raise ValueError("A patient has conflicting labels.")
        by_label[next(iter(labels))].append(patient)
    rng = Random(42)
    splits = {}
    for label in sorted(by_label):
        group = sorted(by_label[label])
        rng.shuffle(group)
        count = round(len(group) * 0.15)
        splits.update((patient, "test") for patient in group[:count])
        splits.update((patient, "val") for patient in group[count:2 * count])
        splits.update((patient, "train") for patient in group[2 * count:])
    return splits


def save_slice(archive, name, output):
    with h5py.File(BytesIO(archive.read(name)), "r") as file:
        image = file["cjdata/image"][:].T
    upper = np.percentile(image[image > 0], 99.5) if image.max() > 0 else 1
    pixels = np.clip(image * (255.0 / upper), 0, 255).astype(np.uint8)
    image = Image.fromarray(pixels).resize((192, 192), Image.LANCZOS)
    image.save(output, compress_level=2)


def prepare(output, cache):
    output = output.resolve()
    if output.exists():
        raise ValueError(f"Choose an unused output directory: {output}")
    paths = download_archives(cache)
    output.parent.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(dir=output.parent) as temp, ExitStack() as stack:
        archives = [stack.enter_context(ZipFile(path)) for path in paths]
        records, patients = read_metadata(archives)
        splits = split_patients(patients)
        folder = Path(temp) / "data"
        counts = {split: Counter() for split in ("train", "val", "test")}
        patient_counts = Counter(splits.values())
        for archive, name, patient, label in records:
            split = splits[patient]
            directory = folder / split / label
            directory.mkdir(parents=True, exist_ok=True)
            save_slice(archive, name, directory / f"{int(Path(name).stem):04d}.png")
            counts[split][label] += 1
        summary = {"source": DOI, "patients": patient_counts, "slices": counts}
        (folder / "dataset.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
        folder.rename(output)
    print(json.dumps(summary, indent=2))


def main():
    parser = argparse.ArgumentParser(description="Download and prepare the Figshare MRI dataset.")
    parser.add_argument("output", type=Path)
    parser.add_argument("--cache", type=Path, default=Path("figshare-downloads"))
    args = parser.parse_args()
    try:
        prepare(args.output, args.cache)
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
