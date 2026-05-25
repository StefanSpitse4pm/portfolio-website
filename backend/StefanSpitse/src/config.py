from dotenv import load_dotenv
import os

class Config:
    load_dotenv(override=True)
    MYSQL_DATABASE_URI = os.getenv('MYSQL_DATABASE_URI', "No database URI found in .env with key MYSQL_DATABASE_URI")
    MYSQL_DATABASE_NAME = os.getenv('MYSQL_DATABASE_NAME', "No database Name found in .env with key MYSQL_DATABASE_NAME")
    SECRET_KEY =  os.getenv('JWT_SECRET_KEY', "No JWT secret key found in .env with key JWT_SECRET_KEY")
    ALGORITHM = 'HS256'
    ACCESS_TOKEN_EXPIRE_TIME = 30

settings = Config()
