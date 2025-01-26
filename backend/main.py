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


def get_content_type(url: str) -> str:
    url = str(url).lower()
    if "instagram.com/stories/" in url:
        return "story"
    elif "instagram.com/reels/" in url:
        return "reels"
    elif "instagram.com/p/" in url:
        return "post"
    elif "youtube.com/watch" in url:
        return "video"
    elif "tiktok.com/@" in url:
        return "profile"
    elif "tiktok.com/" in url:
        return "video"
    return "profile"


SCRAPER_MAP = {
    "instagram": InstagramScraper,
    "youtube": YoutubeScraper,
    "tiktok": TiktokScraper,
    "facebook": FacebookScraper,
}


@app.post("/scrape")
async def scrape_url(request: ScrapeRequest):
    try:
        platform = get_platform(request.url)
        content_type = get_content_type(request.url)
        print(f"Platform: {platform}, Content Type: {content_type}")
        
        if platform == "unknown":
            raise HTTPException(status_code=400, detail="Unsupported platform")

        if platform not in SCRAPER_MAP:
            raise HTTPException(status_code=400, detail=f"No scraper available for platform: {platform}")
            
        try:
            scraper = SCRAPER_MAP[platform]()
            print(f"Scraper initialized for {platform}")
            
            try:
                data = scraper.scrape_profile(str(request.url))
                print(f"Data scraped: {data}")
                return {
                    "success": True,
                    "platform": platform,
                    "content_type": content_type,
                    "data": data,
                }
            except Exception as scrape_error:
                print(f"Scraping error: {str(scrape_error)}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"Error during scraping: {str(scrape_error)}"
                )
            finally:
                scraper.close()
                
        except Exception as init_error:
            print(f"Scraper initialization error: {str(init_error)}")
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to initialize scraper: {str(init_error)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error occurred: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
