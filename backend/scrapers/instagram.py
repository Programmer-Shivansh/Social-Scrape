from scrapers.base import BaseScraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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

        username_env = os.getenv("INSTAGRAM_USERNAME")
        password_env = os.getenv("INSTAGRAM_PASSWORD")

        if not username_env or not password_env:
            raise ValueError("Instagram credentials not found in environment variables")

        self.driver.get("https://www.instagram.com/accounts/login/")
        time.sleep(4)

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

        if "/reels/" in url:
            return self._scrape_reels()
        elif "/p/" in url:
            return self._scrape_post()
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
            "profile_picture": self._get_profile_picture(),
        }

    def _scrape_reels(self):
        try:
            # Initial wait for page load
            time.sleep(3)
            
            # Wait for main content to be visible
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "main"))
            )

            # Simple selectors focused on main content
            base_xpath = "//main"
            
            result = {
                "type": "reels",
                "id": self.driver.current_url.split('/reels/')[1].split('/')[0],
                "likes": self._get_reels_likes_simple(),
                "comments": self._get_reels_comments_simple(),
                "views": self._get_reels_views_simple(),
                "caption": self._get_reels_caption_simple(),
                "author": self._get_reels_author_simple(),
                "music": self._get_reels_music_simple()
            }
            
            return result
            
        except Exception as e:
            print(f"Error scraping reel: {str(e)}")
            return {
                "type": "reels",
                "error": "Failed to scrape reel content",
                "details": str(e)
            }

    def _get_reels_likes_simple(self):
        try:
            likes = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[2]/div[1]/div/div/div/span/span"
            )
            return likes.text if likes.text else "0"
        except:
            return "N/A"

    def _get_reels_comments_simple(self):
        try:
            comments = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[2]/div[2]/div/div/div/div/span/span"
            )
            return comments.text
        except:
            return "N/A"

    def _get_reels_views_simple(self):
        try:
            views = self.driver.find_element(By.XPATH, "//span[contains(@class, 'view')]")
            return views.text
        except:
            return "N/A"

    def _get_reels_caption_simple(self):
        try:
            caption = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[1]/div/div/div/div/div/div/div/div/div/div/div[1]/div[2]/div/div[2]"
            )
            return caption.text
        except:
            return "N/A"

    def _get_reels_author_simple(self):
        try:
            author_div = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[1]/div/div/div/div/div/div/div/div/div/div/div[1]/div[2]/div/div[1]"
            )
            author_link = author_div.find_element(By.TAG_NAME, "a")
            profile_pic = author_div.find_element(By.TAG_NAME, "img")
            return {
                "username": author_link.text.strip('@'),
                "profile_url": author_link.get_attribute("href"),
                "profile_pic": profile_pic.get_attribute("src") if profile_pic else "N/A"
            }
        except:
            return "N/A"

    def _get_reels_music_simple(self):
        try:
            music = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[1]/div/div/div/div/div/div/div/div/div/div/div[1]/div[2]/div/div[3]/div/a/div/div/div[2]/div[1]/span/span"
            )
            return music.text
        except:
            return "N/A"

    def _scrape_post(self):
        time.sleep(3)  # Wait for post to load
        return {
            "type": "post",
            "likes": self._get_post_likes(),
            "comments": self._get_post_comments(),
            "author": self._get_post_author(),
            "upload_date": self._get_post_date(),
            "caption": self._get_post_caption(),
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
                "//div[contains(@id, 'mount_0_0')]/div/div/div[2]/div/div/div[1]/div[2]/div/div[1]/section/main/div/header/section[1]/div/span/div/div",
            )
            img = img_container.find_element(By.TAG_NAME, "img")
            return img.get_attribute("src")
        except:
            try:
                # Fallback to a more general XPath
                img = self.driver.find_element(By.XPATH, "//header//span/div/div//img")
                return img.get_attribute("src")
            except:
                return "N/A"

    def _get_post_likes(self):
        try:
            likes = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[2]/div/div[3]/section[2]/div/div",
            )
            return likes.text if likes.text else "0"
        except:
            return "N/A"

    def _get_post_date(self):
        try:
            date_div = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[2]/div/div[3]/div",
            )
            time_element = date_div.find_element(By.TAG_NAME, "time")
            return {
                "datetime": time_element.get_attribute("datetime"),
                "title": time_element.get_attribute("title"),
                "text": time_element.text,
            }
        except:
            return "N/A"

    def _get_post_caption(self):
        try:
            caption = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div[2]/div/span/div/span",
            )
            return caption.text
        except:
            return "N/A"

    def _get_post_comments(self):
        try:
            # Comments count (if displayed)
            comments_count = self.driver.find_element(
                By.XPATH,
                "//section/main//article//a[contains(@href, 'comments')]//span",
            )
            return comments_count.text
        except:
            try:
                # Expanded comments (requires clicking "View comments" first)
                comments = self.driver.find_elements(
                    By.XPATH,
                    "//section/main//article//ul[contains(@class, '_a9z6')]//div[contains(@class, '_a9zs')]//span",
                )
                return [comment.text for comment in comments]
            except:
                return "N/A"

    def _get_post_author(self):
        try:
            author_div = self.driver.find_element(
                By.XPATH,
                "//div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[2]/div/div[1]",
            )
            author_link = author_div.find_element(By.TAG_NAME, "a")
            return {
                "username": author_link.text.strip("@"),
                "profile_url": author_link.get_attribute("href"),
            }
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
                "//div[contains(@id, 'mount_0_0')]/div/div/div[2]/div/div/div/div[2]/div/div[1]/section/main/div/header/section[2]/div/div[1]/div[1]/div/a/h2",
            )
            return name.text
        except:
            try:
                # Fallback to a more general XPath
                name = self.driver.find_element(
                    By.XPATH, "//section/main/div/header/section//h2"
                )
                return name.text
            except:
                return "N/A"

    def _get_bio(self):
        try:
            # Try the full specific path first
            bio = self.driver.find_element(
                By.XPATH,
                "//div[contains(@id, 'mount_0_0')]/div/div/div[2]/div/div/div[1]/div[2]/div/div[1]/section/main/div/header/section[4]/div/span/div",
            )
            return bio.text
        except:
            try:
                # Fallback to a more general XPath
                bio = self.driver.find_element(
                    By.XPATH, "//section/main//header//span/div"
                )
                return bio.text
            except:
                return "N/A"
