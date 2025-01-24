from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager


class BaseScraper:
    def __init__(self):
        chrome_options = Options()
        # chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()), options=chrome_options
        )

    def close(self):
        self.driver.quit()
