// Content script to block websites
(function () {
  // Check if current URL is blocked
  function checkAndBlockSite() {
    chrome.storage.sync.get(["blockedUrls"], (result) => {
      if (result.blockedUrls && Array.isArray(result.blockedUrls)) {
        const currentUrl = window.location.hostname;
        const isBlocked = result.blockedUrls.some((blockedUrl) => {
          // Remove protocol and www if present
          const cleanBlockedUrl = blockedUrl
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "");
          const cleanCurrentUrl = currentUrl.replace(/^www\./, "");

          // Check if current URL matches or is a subdomain of blocked URL
          return (
            cleanCurrentUrl === cleanBlockedUrl ||
            cleanCurrentUrl.endsWith("." + cleanBlockedUrl)
          );
        });

        if (isBlocked) {
          blockPage();
        }
      }
    });
  }

  // Create and display the blocking overlay
  function blockPage() {
    // Remove any existing overlay
    const existingOverlay = document.getElementById("website-blocker-overlay");
    if (existingOverlay) {
      return;
    }

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "website-blocker-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 2147483647;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    `;

    // Create content container
    const container = document.createElement("div");
    container.style.cssText = `
      text-align: center;
      color: white;
      background: rgba(0, 0, 0, 0.2);
      padding: 60px 80px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
    `;

    // Create icon
    const icon = document.createElement("div");
    icon.innerHTML = "🚫";
    icon.style.cssText = `
      font-size: 80px;
      margin-bottom: 20px;
    `;

    // Create heading
    const heading = document.createElement("h1");
    heading.textContent = "This Page is Blocked";
    heading.style.cssText = `
      font-size: 36px;
      margin: 0 0 20px 0;
      font-weight: 700;
    `;

    // Create message
    const message = document.createElement("p");
    message.textContent = "You have blocked access to this website.";
    message.style.cssText = `
      font-size: 18px;
      margin: 0 0 10px 0;
      opacity: 0.9;
    `;

    // Create URL display
    const urlDisplay = document.createElement("p");
    urlDisplay.textContent = window.location.hostname;
    urlDisplay.style.cssText = `
      font-size: 16px;
      margin: 0;
      opacity: 0.7;
      font-family: monospace;
    `;

    // Assemble the overlay
    container.appendChild(icon);
    container.appendChild(heading);
    container.appendChild(message);
    container.appendChild(urlDisplay);
    overlay.appendChild(container);

    // Add to page
    document.documentElement.appendChild(overlay);

    // Prevent scrolling
    document.body.style.overflow = "hidden";

    // Block all interactions
    overlay.addEventListener("click", (e) => e.stopPropagation(), true);
    overlay.addEventListener("mousedown", (e) => e.stopPropagation(), true);
    overlay.addEventListener(
      "keydown",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );
  }

  // Run check on load
  checkAndBlockSite();

  // Listen for storage changes (when URLs are added/removed)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.blockedUrls) {
      // Reload the page to apply new rules
      window.location.reload();
    }
  });
})();
