from pathlib import Path

from PIL import Image, UnidentifiedImageError
import streamlit as st
from tensorflow.keras.models import load_model

from src.predict import predict_score


MODEL_PATH = Path(__file__).resolve().parent / "model" / "bestmodel.h5"


@st.cache_resource
def open_model():
    return load_model(str(MODEL_PATH), compile=False)


st.title("Brain Tumour Detection")
st.caption("Educational demonstration with sample data.")
if not MODEL_PATH.is_file():
    st.info("Train the model first with python src/train.py --data_dir brain_tumor_dataset.")
else:
    upload = st.file_uploader("Choose an image from the project dataset", type=["jpg", "jpeg", "png"])
    if upload:
        try:
            with Image.open(upload) as source:
                image = source.convert("RGB")
            score = predict_score(open_model(), image)
        except (UnidentifiedImageError, OSError):
            st.error("This file could not be opened as an image.")
        else:
            st.image(image, caption="Sample MRI")
            st.write(f"Model score: {score:.4f}")
            st.write("Model label:", "tumour present" if score >= 0.5 else "no tumour")
