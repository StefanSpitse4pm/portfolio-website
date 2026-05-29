from dotenv import load_dotenv
import os


def _build_mysql_uri() -> str:
    missing = []
    db_name = os.getenv("MYSQL_DATABASE_NAME")
    if not db_name:
        missing.append("MYSQL_DATABASE_NAME")

    user = os.getenv("MYSQL_USER")
    if not user:
        missing.append("MYSQL_USER")

    password = os.getenv("MYSQL_DATABASE_PASSWORD")
    if not password:
        missing.append("MYSQL_DATABASE_PASSWORD")

    if missing:
        missing_list = ", ".join(missing)
        raise ValueError(f"Missing required database settings: {missing_list}")

    host = os.getenv("MYSQL_DATABASE_HOST", "database")
    port = os.getenv("MYSQL_DATABASE_PORT", "3306")

    return f"mysql+asyncmy://{user}:{password}@{host}:{port}/{db_name}"


class Config:
    load_dotenv(override=True)

    MYSQL_DATABASE_URI = os.getenv("MYSQL_DATABASE_URI") or _build_mysql_uri()
    MYSQL_DATABASE_NAME = os.getenv("MYSQL_DATABASE_NAME", "")
    SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_TIME = 30


settings = Config()
