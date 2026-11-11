BRAIN MRI CLASSIFICATION

Use Python 3.11 or 3.12.

    python -m venv .venv
    # Activate the virtual environment for your shell.
    python -m pip install -r requirements.txt

Run the training and prediction steps with abstract sample images:

    python mri_classifier.py demo-data demo-images
    python mri_classifier.py train demo-images demo-model
    python mri_classifier.py predict demo-model demo-images/test/horizontal/000.png

The sample images contain geometric shapes. They only demonstrate that
the training, evaluation, and prediction steps run.

For an educational experiment with a dataset you have permission to
use, put the same class folders under train/, val/, and test/. Each
folder must have labelled PNG or JPEG images. Keep every slice or scan
from a given person in the same split and remove duplicates before
training. This script assumes you have already made that split.

    python mri_classifier.py train your-dataset output-model
    python mri_classifier.py predict output-model path/to/image.png

The output directory contains the Keras model, class labels, and training
history. Reported scores depend on the supplied data. The project is
for education and has no clinical validation.
