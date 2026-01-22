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


# class RollingStateGuideMode(BaseModel):
#     problem: str
#     topics: dict[str, list[str]]
#     approach: str
#     decisions: list[str]
#     pitfallsFlagged: list[str]
#     lastEdit: str
#     nudges: list[str]
#     thoughts_to_remember: list[str]


# type RollingStateGuideMode = {
#   problem: string;
#   nudges: string[]; // keep last N
#   topics: Record<string, { points_to_remember: string[]; pitfalls: string[] }>;
#   lastEdit: string;
# };
