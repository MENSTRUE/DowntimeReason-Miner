from typing import Literal
from pydantic import BaseModel, Field, field_validator
from app.core.config import settings

class SingleText(BaseModel):
    text: str = Field(min_length=3)

    @field_validator('text')
    @classmethod
    def check_text(cls, value: str) -> str:
        value = ' '.join(value.split())
        if len(value) < 3 or len(value) > settings.downtime_max_text_length:
            raise ValueError(f'Text length must be between 3 and {settings.downtime_max_text_length}')
        return value

class BatchText(BaseModel):
    texts: list[str] = Field(min_length=1)

    @field_validator('texts')
    @classmethod
    def check_texts(cls, values: list[str]) -> list[str]:
        if len(values) > settings.downtime_max_batch:
            raise ValueError(f'Maximum {settings.downtime_max_batch} texts per request')
        cleaned = [' '.join(s.split()) for s in values]
        if any(len(x) < 3 or len(x) > settings.downtime_max_text_length for x in cleaned):
            raise ValueError(f'Each text must have 3–{settings.downtime_max_text_length} characters')
        return cleaned

class ClassificationRequest(SingleText):
    experiment: Literal['01','02'] = '02'

class ClassificationBatchRequest(BatchText):
    experiment: Literal['01','02'] = '02'
