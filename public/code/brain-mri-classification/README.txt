BRAIN MRI CLASSIFICATION

Use Python 3.9.

On macOS or Linux:

    python3.9 -m venv .venv
    source .venv/bin/activate
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

The output directory contains model.h5, the class labels, and the training
history. Reported scores depend on the supplied data. The project is
for education and has no clinical validation.

On Windows, create the environment with py -3.9 -m venv .venv and run
.venv\Scripts\activate.bat in Command Prompt before installing requirements.
