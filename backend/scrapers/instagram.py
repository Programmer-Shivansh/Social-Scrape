from scrapers.base import BaseScraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import settings
import time


class InstagramScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.login()

    def login(self):
        self.driver.get("https://www.instagram.com/accounts/login/")
        time.sleep(2)

        username = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, "username"))
        )
        password = self.driver.find_element(By.NAME, "password")

        username.send_keys(settings.INSTAGRAM_USERNAME)
        password.send_keys(settings.INSTAGRAM_PASSWORD)
        password.submit()
        time.sleep(5)

    def scrape_profile(self, url):
        self.driver.get(url)
        time.sleep(3)

        data = {
            "followers": self._get_followers_count(),
            "following": self._get_following_count(),
            "name": self._get_profile_name(),
            "bio": self._get_bio(),
        }
        return data

    def _get_followers_count(self):
        followers = self.driver.find_element(By.CSS_SELECTOR, "li:nth-child(2) span")
        return followers.text

    def _get_following_count(self):
        following = self.driver.find_element(By.CSS_SELECTOR, "li:nth-child(3) span")
        return following.text

    def _get_profile_name(self):
        name = self.driver.find_element(By.CSS_SELECTOR, ".-vDIg h1")
        return name.text

    def _get_bio(self):
        try:
            bio = self.driver.find_element(By.CSS_SELECTOR, ".-vDIg span")
            return bio.text
        except:
            return ""
