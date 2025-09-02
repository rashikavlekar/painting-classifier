FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for OpenCV

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port for Render
EXPOSE 8000

# Run app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
