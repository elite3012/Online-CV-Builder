FROM python:3.11-slim

RUN useradd -m -u 1000 user
ENV HOME=/home/user
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV HF_HOME=/app/.hf-cache
ENV TRACE_DIR=/app/traces
ENV PATH=/home/user/.local/bin:$PATH

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user app ./app
COPY --chown=user evals ./evals
COPY --chown=user traces ./traces

RUN mkdir -p /app/.hf-cache /app/traces && chown -R user:user /app

USER user

EXPOSE 8000

CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
