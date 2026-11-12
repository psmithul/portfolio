BRAIN TUMOUR DETECTION

Use Python 3.9 for the local TensorFlow 2.7 setup.

    python3.9 -m venv .venv
    source .venv/bin/activate
    python -m pip install -r requirements.txt

On Windows, use py -3.9 -m venv .venv and run
.venv\Scripts\activate.bat from Command Prompt.

Download the dataset from the source linked in the project notebook:

    python src/data.py
    python src/train.py --data_dir brain_tumor_dataset --epochs 12 --batch_size 8
    python src/predict.py --model model/bestmodel.h5 --image brain_tumor_dataset/yes/Y3.jpg

Training removes exact pixel duplicates before making the train,
validation and test sets. The dataset has no patient identifiers.
The model checkpoint and training report are written to model/.

For the optional local demo:

    python -m pip install streamlit
    streamlit run app.py

Dataset listing:
https://www.kaggle.com/datasets/navoneel/brain-mri-images-for-brain-tumor-detection

The dataset and trained weights are downloaded or produced separately.
This is an educational project with no clinical validation.
