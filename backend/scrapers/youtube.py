from .base import BaseScraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re

class YoutubeScraper(BaseScraper):
    def scrape_profile(self, url):
        print("Started YouTube scraping")
        self.driver.get(url)
        time.sleep(3)

        # Check URL type
        if 'watch?v=' in url:
            return self._scrape_video()
        elif '/shorts/' in url:
            return self._scrape_shorts()
            
        # Wait for header content to load
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "yt-page-header-renderer"))
        )
        
        metadata = self._get_channel_metadata()
        
        return {
            "type": "youtube_profile",
            "channel_name": metadata.get("channel_name", "N/A"),
            "subscribers": metadata.get("subscribers", "N/A"),
            "total_videos": metadata.get("videos", "N/A"),
            "description": self._get_channel_description(),
            "profile_picture": self._get_profile_picture(),
            "banner_image": self._get_banner_image()
        }

    def _scrape_video(self):
        try:
            time.sleep(3)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "info-container"))
            )

            # Get video info container data for date and hashtags
            info_container = self.driver.find_element(By.XPATH, "//*[@id='info-container']")
            info_text = info_container.text
            
            # Parse only date and hashtags
            date_match = re.search(r'(\d+\s+\w+\s+ago)', info_text)
            hashtags = [tag.strip() for tag in re.findall(r'#\w+', info_text)]

            # Get views directly using specific XPath


            return {
                "type": "youtube_video",
                "author": self._get_video_author(),
                "subscriber_count": self._get_video_subscriber_count(),
                "likes": self._get_video_likes(),
                "description": self._get_video_description(),
                "channel_picture": self._get_video_channel_picture(),
                "views": self._get_video_views(),
                "posted": date_match.group(1) if date_match else "N/A",
                "hashtags": hashtags,
                "video_id": self.driver.current_url.split('v=')[1].split('&')[0]
            }
        except Exception as e:
            print(f"Error scraping video: {str(e)}")
            return {
                "type": "youtube_video",
                "error": "Failed to scrape video content",
                "details": str(e)
            }

    def _scrape_shorts(self):
        try:
            time.sleep(3)
            # Wait for shorts content to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "metapanel"))
            )

            return {
                "type": "youtube_shorts",
                "likes": self._get_shorts_likes(),
                "comments": self._get_shorts_comments(),
                "author": self._get_shorts_author(),
                "description": self._get_shorts_description(),
                "shorts_id": self.driver.current_url.split('/shorts/')[1].split('?')[0]
            }
        except Exception as e:
            print(f"Error scraping shorts: {str(e)}")
            return {
                "type": "youtube_shorts",
                "error": "Failed to scrape shorts content",
                "details": str(e)
            }

    def _get_shorts_likes(self):
        try:
            likes = self.driver.find_element(
                By.XPATH,
                "//*[@id='like-button']/yt-button-shape/label/div/span"
            )
            return likes.text
        except:
            return "N/A"

    def _get_shorts_comments(self):
        try:
            comments = self.driver.find_element(
                By.XPATH,
                "//*[@id='comments-button']/ytd-button-renderer/yt-button-shape/label/div/span"
            )
            return comments.text
        except:
            return "N/A"

    def _get_shorts_author(self):
        try:
            author = self.driver.find_element(
                By.XPATH,
                "//*[@id='metapanel']/yt-reel-metapanel-view-model/div[1]/yt-reel-channel-bar-view-model/span/a"
            )
            profile_pic = self.driver.find_element(
                By.XPATH,
                "//*[@id='metapanel']/yt-reel-metapanel-view-model/div[1]/yt-reel-channel-bar-view-model/yt-decorated-avatar-view-model/yt-avatar-shape/div/div/div/img"
            )
            return {
                "name": author.text,
                "channel_url": author.get_attribute("href"),
                "profile_picture": profile_pic.get_attribute("src")
            }
        except:
            return "N/A"

    def _get_shorts_description(self):
        try:
            desc = self.driver.find_element(
                By.XPATH,
                "//*[@id='metapanel']/yt-reel-metapanel-view-model/div[2]/yt-shorts-video-title-view-model/h2/span"
            )
            return desc.text
        except:
            return "N/A"

    def _get_video_views(self):
        try:
            views = self.driver.find_element(By.XPATH, "//*[@id='info']/span[1]")
            return views.text
        except:
            return "N/A"

    def _get_video_author(self):
        try:
            author = self.driver.find_element(By.XPATH, "//*[@id='text']/a")
            return {
                "name": author.text,
                "channel_url": author.get_attribute("href")
            }
        except:
            return "N/A"

    def _get_video_subscriber_count(self):
        try:
            subs = self.driver.find_element(By.XPATH, "//*[@id='owner-sub-count']")
            return subs.text
        except:
            return "N/A"

    def _get_video_likes(self):
        try:
            likes = self.driver.find_element(
                By.XPATH,
                "//*[@id='top-level-buttons-computed']/segmented-like-dislike-button-view-model/yt-smartimation/div/div/like-button-view-model/toggle-button-view-model/button-view-model/button/div[2]"
            )
            return likes.text
        except:
            return "N/A"

    def _get_video_description(self):
        try:
            desc = self.driver.find_element(By.XPATH, "//*[@id='attributed-snippet-text']/span/span")
            return desc.text
        except:
            return "N/A"

    def _get_video_channel_picture(self):
        try:
            img = self.driver.find_element(By.XPATH, "//*[@id='img']")
            return img.get_attribute("src")
        except:
            return "N/A"

    def _get_channel_metadata(self):
        try:
            # Get subscribers directly with specific XPath
            subscribers_element = self.driver.find_element(
                By.XPATH,
                "//div[@id='page-header']//yt-page-header-renderer/yt-page-header-view-model/div/div[1]/div/yt-content-metadata-view-model/div[2]/span[1]"
            )
            subscribers_text = subscribers_element.text
            
            # Get other metadata from the general container
            metadata_div = self.driver.find_element(
                By.XPATH,
                "//div[@id='page-header']//yt-page-header-renderer/yt-page-header-view-model/div/div[1]/div/yt-content-metadata-view-model"
            )
            text_content = metadata_div.text
            
            # Extract videos count and channel name
            videos = re.search(r'([\d,]+) videos', text_content)
            channel_name = text_content.split('\n')[0] if '\n' in text_content else text_content
            
            return {
                "channel_name": channel_name.strip(),
                "subscribers": subscribers_text,
                "videos": videos.group(1) if videos else "N/A"
            }
        except Exception as e:
            print(f"Error extracting metadata: {str(e)}")
            return {}

    def _get_channel_description(self):
        try:
            desc = self.driver.find_element(
                By.XPATH,
                "//div[@id='page-header']//yt-page-header-renderer/yt-page-header-view-model/div/div[1]/div/yt-description-preview-view-model/truncated-text/truncated-text-content/span"
            )
            return desc.text
        except:
            return "N/A"

    def _get_profile_picture(self):
        try:
            avatar_div = self.driver.find_element(
                By.XPATH,
                "//div[@id='page-header']/yt-page-header-renderer/yt-page-header-view-model/div/div[1]/yt-decorated-avatar-view-model/yt-avatar-shape/div/div/div"
            )
            img = avatar_div.find_element(By.TAG_NAME, "img")
            return img.get_attribute("src") if img else "N/A"
        except:
            return "N/A"

    def _get_banner_image(self):
        try:
            banner = self.driver.find_element(
                By.XPATH,
                "//div[@id='page-header-banner-sizer']/yt-image-banner-view-model/img"
            )
            return banner.get_attribute("src")
        except:
            return "N/A"
