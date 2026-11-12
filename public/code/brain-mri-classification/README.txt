BRAIN MRI CLASSIFICATION

Use Python 3.9. On macOS or Linux:

    python3.9 -m venv .venv
    source .venv/bin/activate
    python -m pip install -r requirements.txt

On Windows, create the environment with py -3.9 -m venv .venv and run
.venv\Scripts\activate.bat in Command Prompt before installing requirements.

Download the Figshare MRI archives and split the slices by patient:

    python prepare_figshare.py figshare-mri
    python mri_classifier.py train figshare-mri output-model --epochs 12 --batch-size 32
    python mri_classifier.py predict output-model figshare-mri/test/glioma/2208.png

The download is about 880 MB. The preparation script verifies the
archives against Figshare's published checksums and stores them in
figshare-downloads. Keep all the slices from a patient in one split.

The output folder contains model.h5, classes.json, and training.json,
including a confusion matrix for the test split. This is an educational
classifier with no clinical validation.

Data: Jun Cheng, Brain Tumor Dataset, Figshare, version 5 (2017).
https://doi.org/10.6084/m9.figshare.1512427.v5
License: https://creativecommons.org/licenses/by/4.0/
