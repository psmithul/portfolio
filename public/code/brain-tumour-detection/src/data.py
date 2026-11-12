import argparse
from pathlib import Path, PurePosixPath
from shutil import copyfileobj
from tempfile import TemporaryDirectory
from urllib.request import urlopen
from zipfile import ZipFile


DATA_URL = "https://www.dropbox.com/s/6v6p7fbs8re3max/archive.zip?dl=1"
FOLDERS = {"no", "yes"}
EXTENSIONS = {".jpeg", ".jpg", ".png"}


def fetch_dataset(output):
    if output.exists():
        raise ValueError(f"Choose an unused output directory: {output}")
    output.parent.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(dir=output.parent) as temp:
        archive = Path(temp) / "archive.zip"
        data = Path(temp) / "dataset"
        with urlopen(DATA_URL, timeout=60) as response, archive.open("wb") as file:
            copyfileobj(response, file)
        with ZipFile(archive) as source:
            for item in source.infolist():
                path = PurePosixPath(item.filename)
                if (len(path.parts) != 3 or path.parts[0] != "brain_tumor_dataset"
                        or path.parts[1] not in FOLDERS or path.suffix.lower() not in EXTENSIONS):
                    continue
                target = data / path.parts[1] / path.name
                target.parent.mkdir(parents=True, exist_ok=True)
                with source.open(item) as image, target.open("wb") as file:
                    copyfileobj(image, file)
        if any(not (data / label).is_dir() for label in FOLDERS):
            raise ValueError("The download does not contain the expected yes and no folders.")
        data.rename(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download the dataset linked in the project notebook.")
    parser.add_argument("output", type=Path, nargs="?", default=Path("brain_tumor_dataset"))
    args = parser.parse_args()
    fetch_dataset(args.output)
