FROM python:3.9.4-buster

WORKDIR /app

RUN pip install --upgrade --no-cache-dir setuptools

COPY requirements.txt .

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "main.py"]
