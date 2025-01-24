from scrapers.base import BaseScraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import settings
import time
import dotenv
import os
import re
dotenv.load_dotenv()

class InstagramScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.login()

    def login(self):

        username_env = os.getenv('INSTAGRAM_USERNAME')
        password_env = os.getenv('INSTAGRAM_PASSWORD')

        if not username_env or not password_env:
            raise ValueError("Instagram credentials not found in environment variables")
        
        self.driver.get("https://www.instagram.com/accounts/login/")
        time.sleep(2)

        username = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, "username"))
        )
        password = self.driver.find_element(By.NAME, "password")

        username.send_keys(username_env)
        password.send_keys(password_env)
        password.submit()
        time.sleep(5)

    def scrape_profile(self, url):
        print("Started Instagram scraping")
        self.driver.get(url)
        time.sleep(3)

        # Check if URL is a reel
        if '/reel/' in url:
            return self._scrape_reel()
        else:
            return self._scrape_user_profile()

    def _scrape_user_profile(self):
        return {
            "type": "profile",
            "followers": self._get_followers_count(),
            "following": self._get_following_count(),
            "name": self._get_profile_name(),
            "bio": self._get_bio(),
            "posts_count": self._get_posts_count(),
            "profile_picture": self._get_profile_picture()
        }

    def _scrape_reel(self):
        time.sleep(3)  # Wait for reel to load
        return {
            "type": "reel",
            "likes": self._get_reel_likes(),
            "comments": self._get_reel_comments(),
            "views": self._get_reel_views(),
            "caption": self._get_reel_caption(),
            "author": self._get_reel_author(),
            "music": self._get_reel_music()
        }

    def _get_posts_count(self):
        try:
            posts = self.driver.find_element(By.XPATH, "//ul/li[1]//span/span")
            return posts.text
        except:
            return "N/A"

    def _get_profile_picture(self):
        try:
            # Try the full specific path first
            img_container = self.driver.find_element(
                By.XPATH, 
                "//div[contains(@id, 'mount_0_0')]/div/div/div[2]/div/div/div[1]/div[2]/div/div[1]/section/main/div/header/section[1]/div/span/div/div"
            )
            img = img_container.find_element(By.TAG_NAME, "img")
            return img.get_attribute('src')
        except:
            try:
                # Fallback to a more general XPath
                img = self.driver.find_element(
                    By.XPATH,
                    "//header//span/div/div//img"
                )
                return img.get_attribute('src')
            except:
                return "N/A"

    def _get_reel_likes(self):
        try:
            likes = self.driver.find_element(By.XPATH, "//section[@class='_ae5m']//span[@class='_aacl']")
            return likes.text
        except:
            return "N/A"

    def _get_reel_comments(self):
        try:
            comments = self.driver.find_element(By.XPATH, "//span[contains(@class, '_ae5q')]")
            return comments.text
        except:
            return "N/A"

    def _get_reel_views(self):
        try:
            views = self.driver.find_element(By.XPATH, "//span[contains(@class, '_aacp')]")
            return views.text
        except:
            return "N/A"

    def _get_reel_caption(self):
        try:
            caption = self.driver.find_element(By.XPATH, "//div[contains(@class, '_a9zs')]")
            return caption.text
        except:
            return "N/A"

    def _get_reel_author(self):
        try:
            author = self.driver.find_element(By.XPATH, "//a[contains(@class, '_aap6')]")
            return {
                "username": author.text,
                "profile_url": author.get_attribute('href')
            }
        except:
            return "N/A"

    def _get_reel_music(self):
        try:
            music = self.driver.find_element(By.XPATH, "//span[contains(@class, '_aacl _aaco _aacu')]")
            return music.text
        except:
            return "N/A"

    def _get_followers_count(self):
        followers = self.driver.find_element(By.XPATH, "//ul/li[2]//span/span")
        return followers.text

    def _get_following_count(self):
        following = self.driver.find_element(By.XPATH, "//ul/li[3]//span/span")
        return following.text

    def _get_profile_name(self):
        try:
            # Try the full specific path first
            name = self.driver.find_element(
                By.XPATH, 
                "//div[contains(@id, 'mount_0_0')]/div/div/div[2]/div/div/div/div[2]/div/div[1]/section/main/div/header/section[2]/div/div[1]/div[1]/div/a/h2"
            )
            return name.text
        except:
            try:
                # Fallback to a more general XPath
                name = self.driver.find_element(
                    By.XPATH,
                    "//section/main/div/header/section//h2"
                )
                return name.text
            except:
                return "N/A"

    def _get_bio(self):
        try:
            # Try the full specific path first
            bio = self.driver.find_element(
                By.XPATH, 
                "//div[contains(@id, 'mount_0_0')]/div/div/div[2]/div/div/div[1]/div[2]/div/div[1]/section/main/div/header/section[4]/div/span/div"
            )
            return bio.text
        except:
            try:
                # Fallback to a more general XPath
                bio = self.driver.find_element(
                    By.XPATH,
                    "//section/main//header//span/div"
                )
                return bio.text
            except:
                return "N/A"
