import os
from huggingface_hub import InferenceClient

# Ambil API key dari variabel lingkungan
api_key = "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"
model = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"

# Periksa apakah API key ada
if not api_key:
    print("Error: HUGGINGFACE_API_KEY")
    exit(1)

# Inisialisasi klien Inference
client = InferenceClient(token=api_key)

try:
    # Lakukan permintaan generasi teks sederhana
    prompt = "Apa ibu kota Indonesia?"
    response = client.text_generation(
        prompt,
        model=model,
        max_new_tokens=200,
        temperature=0.7
    )
    
    # Cetak hasil
    print("API Key valid! Respons dari model:")
    print(response)

except Exception as e:
    # Tangani error, seperti kredensial tidak valid
    print("Gagal memvalidasi API Key. Detail error:")
    print(str(e))