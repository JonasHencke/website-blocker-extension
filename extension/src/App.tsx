import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    // Load blocked URLs from Chrome storage
    chrome.storage.sync.get(["blockedUrls"], (result) => {
      if (result.blockedUrls && Array.isArray(result.blockedUrls)) {
        setBlockedUrls(result.blockedUrls);
      }
    });
  }, []);

  const addUrl = () => {
    if (urlInput.trim() === "") return;

    const newBlockedUrls = [...blockedUrls, urlInput.trim()];
    setBlockedUrls(newBlockedUrls);
    setUrlInput("");

    // Save to Chrome storage
    chrome.storage.sync.set({ blockedUrls: newBlockedUrls });
  };

  const removeUrl = (index: number) => {
    const newBlockedUrls = blockedUrls.filter((_, i) => i !== index);
    setBlockedUrls(newBlockedUrls);

    // Save to Chrome storage
    chrome.storage.sync.set({ blockedUrls: newBlockedUrls });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addUrl();
    }
  };

  return (
    <div style={{ padding: "20px", minWidth: "400px" }}>
      <h1>Website Blocker</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Add URL to Block</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter URL (e.g., facebook.com)"
            style={{
              flex: 1,
              padding: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={addUrl}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              borderRadius: "4px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h2>Blocked URLs ({blockedUrls.length})</h2>
        {blockedUrls.length === 0 ? (
          <p style={{ color: "#666" }}>No URLs blocked yet</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {blockedUrls.map((url, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <span style={{ wordBreak: "break-all" }}>{url}</span>
                <button
                  onClick={() => removeUrl(index)}
                  style={{
                    padding: "4px 12px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
