FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

WORKDIR /aiml

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY ./ ./

