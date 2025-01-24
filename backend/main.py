from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from scrapers.instagram import InstagramScraper
from scrapers.youtube import YoutubeScraper
from scrapers.tiktok import TiktokScraper
from scrapers.facebook import FacebookScraper
import uvicorn
from typing import Dict
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: HttpUrl
    scrape_type: str

def get_platform(url: str) -> str:
    url = str(url).lower()
    if "instagram.com" in url:
        return "instagram"
    elif "youtube.com" in url or "youtu.be" in url:
        return "youtube"
    elif "tiktok.com" in url:
        return "tiktok"
    elif "facebook.com" in url:
        return "facebook"
    else:
        return "unknown"

SCRAPER_MAP = {
    "instagram": InstagramScraper,
    "youtube": YoutubeScraper,
    "tiktok": TiktokScraper,
    "facebook": FacebookScraper
}

@app.post("/scrape")
async def scrape_url(request: ScrapeRequest):
    try:
        platform = get_platform(request.url)
        if platform == "unknown":
            raise HTTPException(status_code=400, detail="Unsupported platform")

        scraper_class = SCRAPER_MAP.get(platform)
        scraper = scraper_class()
        
        try:
            data = scraper.scrape_profile(str(request.url))
            return {"success": True, "platform": platform, "data": data}
        finally:
            scraper.close()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
