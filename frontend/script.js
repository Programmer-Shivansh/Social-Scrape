document.getElementById("scrapeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("urlInput").value;
  const scrapeType = document.getElementById("scrapeType").value;
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "Loading...";

  try {
    const response = await fetch("http://localhost:8000/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        scrape_type: scrapeType,
      }),
    });

    const data = await response.json();

    if (data.success) {
      resultsDiv.innerHTML = `
                <h2>Results:</h2>
                <pre>${JSON.stringify(data.data, null, 2)}</pre>
            `;
    } else {
      resultsDiv.innerHTML = "Error: " + data.detail;
    }
  } catch (error) {
    resultsDiv.innerHTML = "Error: " + error.message;
  }
});
