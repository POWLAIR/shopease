from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # API
    API_PORT: int = 8000
    NODE_ENV: str = "development"

    # Postgres
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "shopease"
    POSTGRES_USER: str = "admin"
    POSTGRES_PASSWORD: str = "admin"

    # Mongo
    MONGO_URI: str = "mongodb://mongo:27017"
    MONGO_DB: str = "shopease"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

