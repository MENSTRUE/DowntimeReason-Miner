from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

HERE = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(HERE / '.env'), extra='ignore')
    downtime_model_dir: Path = HERE.parent / 'models'
    downtime_report_dir: Path = HERE.parent / 'reports'
    downtime_cors_origins: str = 'http://localhost:5173,http://127.0.0.1:5173'
    downtime_max_batch: int = Field(default=100, ge=1, le=1000)
    downtime_max_text_length: int = Field(default=5000, ge=20, le=20000)

    @property
    def origins(self) -> list[str]:
        return [x.strip() for x in self.downtime_cors_origins.split(',') if x.strip()]

settings = Settings()
