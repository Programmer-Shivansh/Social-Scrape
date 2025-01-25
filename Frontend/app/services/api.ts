export const scrapeUrl = async (url: string) => {
  try {
    const response = await fetch('http://localhost:8000/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        url,
        scrape_type: 'full'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Backend server is not running. Please start the server.');
    }
    throw error;
  }
};
