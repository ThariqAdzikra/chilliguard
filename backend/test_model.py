"""Test script untuk memeriksa loading model."""
import traceback

try:
    print("Loading TensorFlow...")
    from tensorflow import keras
    print("TensorFlow loaded successfully.")
    
    print("\nLoading model...")
    model = keras.models.load_model('api/ml_models/chiligard_model_v1.keras')
    print("SUCCESS! Model loaded.")
    print("\nModel summary:")
    model.summary()
except Exception as e:
    print(f"\nERROR: {type(e).__name__}: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
