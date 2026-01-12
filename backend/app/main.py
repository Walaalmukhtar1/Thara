from fastapi import FastAPI

from .data import EASTERN_REGION
from .personalize import personalize

app = FastAPI(
    title="Thara API – MVP",
    description="From one shared cultural source, different users experience heritage differently.",
    version="1.0"
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Thara backend is running"
    }


@app.post("/experience")
def get_experience(persona: str, interest: str):
    return personalize(
        region=EASTERN_REGION,
        persona=persona,
        interest=interest
    )
