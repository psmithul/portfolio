import argparse

import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img


IMG_SIZE = (224, 224)


def predict_score(model, image):
    image = image.convert("RGB").resize(IMG_SIZE, Image.NEAREST)
    batch = np.expand_dims(img_to_array(image) / 255.0, axis=0)
    return float(model(batch, training=False).numpy()[0][0])


def predict_image(model, image_path):
    with load_img(image_path) as image:
        return predict_score(model, image)


def main():
    parser = argparse.ArgumentParser(description="Score an example MRI with the saved CNN.")
    parser.add_argument("--model", required=True)
    parser.add_argument("--image", required=True)
    args = parser.parse_args()
    model = load_model(args.model, compile=False)
    score = predict_image(model, args.image)
    print(f"Model score: {score:.4f}")
    print("Model label:", "tumour present" if score >= 0.5 else "no tumour")


if __name__ == "__main__":
    main()
