from .base import BaseScraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re

class YoutubeScraper(BaseScraper):
    def scrape_profile(self, url):
        self.driver.get(url)
        time.sleep(3)
        
        data = {
            "subscribers": self._get_subscriber_count(),
            "total_videos": self._get_video_count(),
            "channel_name": self._get_channel_name(),
            "description": self._get_description()
        }
        return data

    def _get_subscriber_count(self):
        try:
            subs = self.driver.find_element(By.XPATH, "//yt-formatted-string[@id='subscriber-count']")
            return subs.text
        except:
            return "N/A"

    def _get_video_count(self):
        try:
            videos = self.driver.find_element(By.XPATH, "//yt-formatted-string[@id='videos-count']")
            return videos.text
        except:
            return "N/A"

    def _get_channel_name(self):
        try:
            name = self.driver.find_element(By.XPATH, "//yt-formatted-string[@id='channel-name']")
            return name.text
        except:
            return "N/A"

    def _get_description(self):
        try:
            desc = self.driver.find_element(By.XPATH, "//yt-formatted-string[@id='description']")
            return desc.text
        except:
            return "N/A"
