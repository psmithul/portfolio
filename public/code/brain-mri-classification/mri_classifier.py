import argparse
import json
import random
from pathlib import Path


IMAGE_SIZE = (96, 96)
SEED = 42


def load_images(generator, root, split, class_names, batch_size):
    path = root / split
    if not path.is_dir():
        raise ValueError(f"Missing directory: {path}")
    folders = sorted(entry.name for entry in path.iterdir()
                     if entry.is_dir() and not entry.name.startswith("."))
    if folders != class_names:
        raise ValueError(f"{path} must contain the same class folders as the training split.")

    images = generator.flow_from_directory(
        str(path), classes=class_names, color_mode="grayscale", target_size=IMAGE_SIZE,
        class_mode="sparse", batch_size=batch_size, shuffle=(split == "train"),
        interpolation="bilinear", seed=SEED,
    )
    for index, name in enumerate(class_names):
        if index not in images.classes:
            raise ValueError(f"No supported images in {path / name}")
    return images


def build_model(tf, classes):
    layers = tf.keras.layers
    model = tf.keras.Sequential([
        layers.Input(shape=(*IMAGE_SIZE, 1)),
        layers.Conv2D(16, 3, padding="same", activation="relu"),
        layers.MaxPooling2D(),
        layers.Conv2D(32, 3, padding="same", activation="relu"),
        layers.MaxPooling2D(),
        layers.Conv2D(64, 3, padding="same", activation="relu"),
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.25, seed=SEED),
        layers.Dense(classes, activation="softmax"),
    ])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def train(dataset, output, epochs, batch_size):
    import numpy as np
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    dataset = dataset.resolve()
    if output.exists():
        raise ValueError(f"Choose an unused output directory: {output}")
    if not (dataset / "train").is_dir():
        raise ValueError(f"Missing directory: {dataset / 'train'}")
    class_names = sorted(entry.name for entry in (dataset / "train").iterdir()
                         if entry.is_dir() and not entry.name.startswith("."))
    if len(class_names) < 2:
        raise ValueError("The training split needs at least two class folders.")

    random.seed(SEED)
    np.random.seed(SEED)
    tf.random.set_seed(SEED)
    training_data = ImageDataGenerator(
        rescale=1.0 / 255, rotation_range=11, width_shift_range=0.04,
        height_shift_range=0.04, fill_mode="reflect",
    )
    evaluation_data = ImageDataGenerator(rescale=1.0 / 255)
    train_images = load_images(training_data, dataset, "train", class_names, batch_size)
    val_images = load_images(evaluation_data, dataset, "val", class_names, batch_size)
    test_images = load_images(evaluation_data, dataset, "test", class_names, batch_size)

    model = build_model(tf, len(class_names))
    history = model.fit(
        train_images, validation_data=val_images, epochs=epochs,
        callbacks=[tf.keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=4, restore_best_weights=True,
        )],
    )
    scores = model.evaluate(test_images, return_dict=True)
    output.mkdir(parents=True)
    model.save(str(output / "model.h5"), include_optimizer=False)
    (output / "classes.json").write_text(json.dumps(class_names, indent=2) + "\n", encoding="utf-8")
    report = {"epochs": history.history, "test": scores}
    (output / "training.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Test accuracy: {scores['accuracy']:.1%}")


def predict(output, image_file):
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import img_to_array, load_img

    model = tf.keras.models.load_model(str(output / "model.h5"), compile=False)
    labels = json.loads((output / "classes.json").read_text(encoding="utf-8"))
    image = load_img(
        str(image_file), color_mode="grayscale", target_size=IMAGE_SIZE, interpolation="bilinear",
    )
    batch = tf.expand_dims(img_to_array(image) / 255.0, axis=0)
    scores = model(batch, training=False).numpy()[0]
    if len(labels) != len(scores):
        raise ValueError("The saved labels do not match the model output.")
    for label, score in sorted(zip(labels, scores), key=lambda item: item[1], reverse=True):
        print(f"{label:20s} {score:.3f}")


def make_demo(root):
    from PIL import Image, ImageDraw, ImageFilter

    if root.exists():
        raise ValueError(f"Choose an unused demo directory: {root}")
    rng = random.Random(SEED)
    for split, count in (("train", 64), ("val", 16), ("test", 16)):
        for label, size in (("horizontal", (25, 7)), ("vertical", (7, 25))):
            folder = root / split / label
            folder.mkdir(parents=True)
            for index in range(count):
                image = Image.new("L", (96, 96))
                image.putdata([rng.randint(10, 55) for _ in range(96 * 96)])
                x, y = rng.randint(32, 64), rng.randint(32, 64)
                width, height = size
                ImageDraw.Draw(image).ellipse(
                    (x - width, y - height, x + width, y + height), fill=rng.randint(170, 235),
                )
                image = image.rotate(rng.uniform(-12, 12), resample=Image.BILINEAR,
                                     fillcolor=30).filter(ImageFilter.GaussianBlur(1))
                image.save(folder / f"{index:03d}.png")


def positive_integer(value):
    number = int(value)
    if number < 1:
        raise argparse.ArgumentTypeError("Use a positive integer.")
    return number


def main():
    parser = argparse.ArgumentParser(description="Train a grayscale image classifier and predict labels.")
    commands = parser.add_subparsers(dest="command", required=True)
    demo = commands.add_parser("demo-data", help="Generate abstract sample images")
    demo.add_argument("dataset", type=Path)
    training = commands.add_parser("train", help="Train and evaluate on a directory of images")
    training.add_argument("dataset", type=Path)
    training.add_argument("output", type=Path)
    training.add_argument("--epochs", type=positive_integer, default=15)
    training.add_argument("--batch-size", type=positive_integer, default=16)
    inference = commands.add_parser("predict", help="Print model scores for an image")
    inference.add_argument("output", type=Path)
    inference.add_argument("image", type=Path)
    args = parser.parse_args()

    try:
        if args.command == "demo-data":
            make_demo(args.dataset)
        elif args.command == "train":
            train(args.dataset, args.output, args.epochs, args.batch_size)
        else:
            predict(args.output, args.image)
    except (OSError, ImportError, ValueError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
