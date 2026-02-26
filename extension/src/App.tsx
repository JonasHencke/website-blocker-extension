import { useState, useEffect } from "react";

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
    <div className="min-w-[360px] max-w-lg space-y-8 rounded-3xl bg-white/95 p-6 text-slate-900 shadow-2xl">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Website Blocker
        </h1>
        <p className="text-sm text-slate-500">
          Add domains you want to keep off-limits and manage them in seconds.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <h2 className="text-base font-semibold text-slate-800">
          Add URL to block
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter URL (e.g., facebook.com)"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="button"
            onClick={addUrl}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Blocked URLs
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {blockedUrls.length}
          </span>
        </div>
        {blockedUrls.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            No URLs blocked yet
          </p>
        ) : (
          <ul className="space-y-3">
            {blockedUrls.map((url, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm shadow-sm"
              >
                <span className="break-all font-medium text-slate-700">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="ml-4 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
