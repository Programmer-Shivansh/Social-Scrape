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
            # raise ValueError("Instagram credentials not found in environment variables")
            os.environ["INSTAGRAM_USERNAME"] = "default_username"  
            os.environ["INSTAGRAM_PASSWORD"] = "default_password"  


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

        if "/stories/" in url:
            return self._scrape_stories()
        elif "/reels/" in url:
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
            # Try the new specific XPath first
            img = self.driver.find_element(
                By.XPATH,
                "//section/main/div/header/section[1]/div/span/div/div/span/img"
            )
            return img.get_attribute("src")
        except:
            try:
                # First fallback: try finding any img within the header
                img = self.driver.find_element(
                    By.XPATH,
                    "//section/main/div/header//img"
                )
                return img.get_attribute("src")
            except:
                try:
                    # Second fallback: try finding by class name pattern
                    img = self.driver.find_element(
                        By.CSS_SELECTOR,
                        "header img._aadp"
                    )
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

    def _scrape_stories(self):
        try:
            print("Starting stories scrape")
            time.sleep(5)

            # Click menu button using JavaScript
            self.driver.execute_script("""
                var elements = document.querySelectorAll('button,div[role="button"]');
                for (var el of elements) {
                    if (el.innerHTML.includes('Menu') || 
                        el.textContent.includes('More options') ||
                        el.getAttribute('aria-label')?.includes('Menu')) {
                        el.click();
                        return true;
                    }
                }
                return false;
            """)
            print("Clicked menu button successfully")
            time.sleep(2)

            # Click "About this account" using JavaScript
            self.driver.execute_script("""
                var buttons = document.querySelectorAll('button');
                for (var btn of buttons) {
                    if (btn.textContent.includes('About this account')) {
                        btn.click();
                        return true;
                    }
                }
            """)
            print("Clicked About this account button")
            time.sleep(3)

            # Get data from About modal
            return {
                "type": "story",
                "profile_image": self._get_about_profile_image(),
                "author_info": self._get_about_author(),
                "metadata": self._get_about_metadata()
            }

        except Exception as e:
            print(f"Error in _scrape_stories: {str(e)}")
            return {
                "type": "story",
                "error": "Failed to access story",
                "details": str(e)
            }

    def _get_about_profile_image(self):
        try:
            # Try multiple selectors to find the profile image
            selectors = [
                "//img[@class='wbloks_1']",
                "//img[contains(@class, 'wbloks_1')]",
                "//div[4]//img[contains(@src, 'instagram.com')]",
                "//img[@data-bloks-name='bk.components.Image']"
            ]
            
            for selector in selectors:
                try:
                    img = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, selector))
                    )
                    src = img.get_attribute("src")
                    if src and 'instagram.com' in src:
                        return src
                except:
                    continue
                    
            return "N/A"
        except Exception as e:
            print(f"Failed to get profile image: {str(e)}")
            return "N/A"

    def _get_about_author(self):
        try:
            # Try multiple selectors to find the author name
            selectors = [
                "//span[@role='heading']",
                "//span[contains(@style, 'font-weight: 700')]",
                "//div[contains(@class, 'wbloks_1')]//span[@data-bloks-name='bk.components.Text']",
                "//span[@data-bloks-name='bk.components.Text'][@role='heading']"
            ]
            
            for selector in selectors:
                try:
                    author = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, selector))
                    )
                    text = author.text or author.get_attribute("aria-label")
                    if text:
                        return text
                except:
                    continue
                    
            return "N/A"
        except Exception as e:
            print(f"Failed to get author info: {str(e)}")
            return "N/A"

    def _get_about_metadata(self):
        try:
            metadata = {}
            
            # Date joined - look for div with "Date joined" text
            try:
                date_joined_div = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((
                        By.XPATH,
                        "//div[@data-bloks-name='bk.components.Flexbox'][@role='button'][@aria-label='Date joined']"
                    ))
                )
                date_text = date_joined_div.find_element(
                    By.XPATH,
                    ".//span[contains(@style, 'color: rgb(168, 168, 168)')]"
                ).text
                metadata['date_joined'] = date_text
            except Exception as e:
                print(f"Failed to get date joined: {str(e)}")
                metadata['date_joined'] = "N/A"

            # Account based in
            try:
                location_div = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((
                        By.XPATH,
                        "//div[@data-bloks-name='bk.components.Flexbox'][@role='button'][@aria-label='Account based in']"
                    ))
                )
                location_text = location_div.find_element(
                    By.XPATH,
                    ".//span[contains(@style, 'color: rgb(168, 168, 168)')]"
                ).text
                metadata['account_based'] = location_text
            except Exception as e:
                print(f"Failed to get location: {str(e)}")
                metadata['account_based'] = "N/A"

            # Verified status
            try:
                verified_text = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((
                        By.XPATH,
                        "//span[@data-bloks-name='bk.components.Text'][@style='font-weight: 400; padding: unset; line-height: 1.3; font-size: 14px; color: rgb(168, 168, 168); white-space: pre-wrap; overflow-wrap: break-word;']"
                    ))
                ).text
                metadata['verified_on'] = verified_text
            except Exception as e:
                print(f"Failed to get verified status: {str(e)}")
                metadata['verified_on'] = "N/A"

            return metadata

        except Exception as e:
            print(f"Failed to get metadata: {str(e)}")
            return "N/A"
