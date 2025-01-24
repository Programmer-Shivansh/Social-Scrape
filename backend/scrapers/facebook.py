from scrapers.base import BaseScraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from config import settings


class FacebookScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.login()

    def login(self):
        self.driver.get("https://www.facebook.com/login")
        time.sleep(2)

        email = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        password = self.driver.find_element(By.ID, "pass")

        email.send_keys(settings.FACEBOOK_EMAIL)
        password.send_keys(settings.FACEBOOK_PASSWORD)
        password.submit()
        time.sleep(5)

    def scrape_profile(self, url):
        self.driver.get(url)
        time.sleep(3)

        data = {
            "followers": self._get_followers(),
            "name": self._get_name(),
            "about": self._get_about(),
            "page_likes": self._get_page_likes(),
        }
        return data

    def _get_followers(self):
        try:
            followers = self.driver.find_element(By.XPATH, "//div[@role='tablist']//div[contains(text(), 'Followers')]")
            return followers.text
        except:
            return "N/A"

    def _get_name(self):
        try:
            name = self.driver.find_element(By.XPATH, "//h1[contains(@class, 'x1heor9g')]")
            return name.text
        except:
            return "N/A"

    def _get_about(self):
        try:
            about = self.driver.find_element(By.XPATH, "//div[@role='tablist']//div[contains(text(), 'About')]")
            return about.text
        except:
            return "N/A"

    def _get_page_likes(self):
        try:
            likes = self.driver.find_element(By.XPATH, "//div[@role='tablist']//div[contains(text(), 'Likes')]")
            return likes.text
        except:
            return "N/A"
