from pydantic import BaseModel


class RollingStateGuideMode(BaseModel):
    problem: str
    topics: dict[str, list[str]]
    approach: str
    decisions: list[str]
    pitfallsFlagged: list[str]
    lastEdit: str
    nudges: list[str]
    thoughts_to_remember: list[str]
