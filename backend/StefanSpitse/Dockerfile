FROM python:3.12
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt
ENV PATH="/usr/local/bin:$PATH"
COPY ./src /app/src
WORKDIR /app/src
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 80"]
