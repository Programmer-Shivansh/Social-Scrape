from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CHROME_DRIVER_PATH: str = "chromedriver"
    INSTAGRAM_USERNAME: str
    INSTAGRAM_PASSWORD: str
    FACEBOOK_EMAIL: str
    FACEBOOK_PASSWORD: str

    class Config:
        env_file = ".env"

settings = Settings()
