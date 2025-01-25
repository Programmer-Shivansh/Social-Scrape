document.getElementById("scrapeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = document.getElementById("urlInput").value;
    const platformInfo = document.getElementById("platform-info");
    const contentType = document.getElementById("content-type");
    const scrapeData = document.getElementById("scrape-data");

    // Clear previous results
    platformInfo.textContent = "Loading...";
    contentType.textContent = "";
    scrapeData.textContent = "";

    try {
        const response = await fetch("http://localhost:8000/scrape", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
                scrape_type: "all"  // We're now always requesting all data
            }),
        });

        const data = await response.json();

        if (data.success) {
            // Display platform and content type
            platformInfo.textContent = `Platform: ${data.platform.toUpperCase()}`;
            contentType.textContent = `Content Type: ${data.content_type}`;

            // Display the scraped data
            const formattedData = JSON.stringify(data.data, null, 2);
            scrapeData.innerHTML = `<pre>${formattedData}</pre>`;
            
            // Add success styling
            scrapeData.classList.remove("error");
        } else {
            throw new Error(data.detail || "Failed to scrape data");
        }
    } catch (error) {
        // Display error with styling
        platformInfo.textContent = "Error";
        contentType.textContent = "";
        scrapeData.textContent = `Error: ${error.message}`;
        scrapeData.classList.add("error");
    }
});
