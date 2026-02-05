from pydantic import BaseModel, Field


class TopicNotes(BaseModel):
    thoughts_to_remember: list[str] = Field(default_factory=list)
    pitfalls: list[str] = Field(default_factory=list)


class RollingStateGuideMode(BaseModel):
    problem: str
    nudges: list[str] = Field(default_factory=list)
    lastEdit: str = ""

    class Config:
        extra = "allow"