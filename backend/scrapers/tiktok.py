from .base import BaseScraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TiktokScraper(BaseScraper):
    def scrape_profile(self, url):
        self.driver.get(url)
        time.sleep(5)  # TikTok needs more time to load
        
        data = {
            "followers": self._get_followers(),
            "following": self._get_following(),
            "likes": self._get_likes(),
            "bio": self._get_bio(),
            "username": self._get_username()
        }
        return data

    def _get_followers(self):
        try:
            followers = self.driver.find_element(By.XPATH, "//strong[@data-e2e='followers-count']")
            return followers.text
        except:
            return "N/A"

    def _get_following(self):
        try:
            following = self.driver.find_element(By.XPATH, "//strong[@data-e2e='following-count']")
            return following.text
        except:
            return "N/A"

    def _get_likes(self):
        try:
            likes = self.driver.find_element(By.XPATH, "//strong[@data-e2e='likes-count']")
            return likes.text
        except:
            return "N/A"

    def _get_bio(self):
        try:
            bio = self.driver.find_element(By.XPATH, "//h2[@data-e2e='user-bio']/span")
            return bio.text
        except:
            return "N/A"

    def _get_username(self):
        try:
            username = self.driver.find_element(By.XPATH, "//h1[@data-e2e='user-title']")
            return username.text
        except:
            return "N/A"
