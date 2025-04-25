FROM python:3.10-slim

WORKDIR /app

# Ajout des paquets nécessaires pour compiler les dépendances
RUN apt-get update && apt-get install -y gcc build-essential libffi-dev

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
