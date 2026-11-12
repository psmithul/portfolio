import argparse
from hashlib import sha256
import json
from pathlib import Path
from random import Random
from shutil import copyfile
from tempfile import TemporaryDirectory

import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.layers import Conv2D, Dense, Dropout, Flatten, Input, MaxPool2D
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator


IMG_SIZE = (224, 224)
CLASSES = ("no", "yes")
SEED = 42
SUFFIXES = {".jpeg", ".jpg", ".png"}


def build_model():
    model = Sequential([
        Input(shape=(*IMG_SIZE, 3)),
        Conv2D(16, (3, 3), activation="relu"),
        Conv2D(36, (3, 3), activation="relu"),
        MaxPool2D(pool_size=(2, 2)),
        Conv2D(64, (3, 3), activation="relu"),
        MaxPool2D(pool_size=(2, 2)),
        Conv2D(128, (3, 3), activation="relu"),
        MaxPool2D(pool_size=(2, 2)),
        Dropout(0.25),
        Flatten(),
        Dense(64, activation="relu"),
        Dropout(0.25),
        Dense(1, activation="sigmoid"),
    ])
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
    return model


def split_images(data_dir):
    rng = Random(SEED)
    seen = {}
    groups = {name: {} for name in ("train", "val", "test")}
    for label in CLASSES:
        files = sorted(path for path in (data_dir / label).iterdir()
                       if path.is_file() and path.suffix.lower() in SUFFIXES)
        unique = []
        for path in files:
            with Image.open(path) as image:
                rgb = image.convert("RGB")
                key = (rgb.size, sha256(rgb.tobytes()).digest())
            if key in seen:
                if seen[key] != label:
                    raise ValueError(f"Image has conflicting labels: {path}")
                continue
            seen[key] = label
            unique.append(path)
        if len(unique) < 7:
            raise ValueError(f"Need at least seven unique images in {data_dir / label}.")
        rng.shuffle(unique)
        held_out = round(len(unique) * 0.15)
        groups["test"][label] = unique[:held_out]
        groups["val"][label] = unique[held_out:2 * held_out]
        groups["train"][label] = unique[2 * held_out:]
    return groups


def create_generators(data_dir, batch_size):
    training = ImageDataGenerator(
        rescale=1 / 255, zoom_range=0.2, shear_range=0.2, horizontal_flip=True,
    )
    evaluation = ImageDataGenerator(rescale=1 / 255)
    return [
        (training if split == "train" else evaluation).flow_from_directory(
            str(data_dir / split), target_size=IMG_SIZE, batch_size=batch_size,
            class_mode="binary", classes=list(CLASSES), shuffle=(split == "train"), seed=SEED,
        )
        for split in ("train", "val", "test")
    ]


def train(data_dir, model_dir, epochs=30, batch_size=16):
    if min(epochs, batch_size) < 1:
        raise ValueError("Epochs and batch size must be positive.")
    groups = split_images(data_dir)
    np.random.seed(SEED)
    tf.random.set_seed(SEED)
    model_dir.mkdir(parents=True, exist_ok=True)
    checkpoint = model_dir / "bestmodel.h5"

    with TemporaryDirectory() as temp:
        root = Path(temp)
        for split, classes in groups.items():
            for label, paths in classes.items():
                folder = root / split / label
                folder.mkdir(parents=True)
                for path in paths:
                    copyfile(path, folder / path.name)

        train_data, val_data, test_data = create_generators(root, batch_size)
        model = build_model()
        history = model.fit(
            train_data, epochs=epochs, validation_data=val_data,
            callbacks=[
                EarlyStopping(monitor="val_accuracy", patience=6, mode="max"),
                ModelCheckpoint(str(checkpoint), monitor="val_accuracy", mode="max", save_best_only=True),
            ],
        )
        best = load_model(str(checkpoint), compile=False)
        predictions = (best.predict(test_data).ravel() >= 0.5).astype(int)
        matrix = np.zeros((2, 2), dtype=int)
        np.add.at(matrix, (test_data.classes, predictions), 1)

    report = {
        "history": history.history,
        "counts": {split: {label: len(paths) for label, paths in classes.items()}
                   for split, classes in groups.items()},
        "classes": list(CLASSES),
        "confusion_matrix": matrix.tolist(),
        "test_accuracy": float(np.trace(matrix) / matrix.sum()),
    }
    (model_dir / "training.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Test accuracy: {report['test_accuracy']:.1%}")
    return report


def main():
    parser = argparse.ArgumentParser(description="Train a binary CNN on MRI images in yes and no folders.")
    parser.add_argument("--data_dir", type=Path, required=True)
    parser.add_argument("--model_dir", type=Path, default=Path("model"))
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--batch_size", type=int, default=16)
    args = parser.parse_args()
    try:
        train(args.data_dir, args.model_dir, args.epochs, args.batch_size)
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
