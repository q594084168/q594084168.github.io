/**
 * ToneModifier V2 — Homepage Script
 */
const WORKER_URL = "https://tone-modifier.594084168.workers.dev";

async function processText() {
  const input = document.getElementById("inputText").value.trim();
  if (!input) { document.getElementById("status").textContent = "Please enter text first."; return }

  const btn = document.getElementById("submitBtn");
  btn.disabled = true; btn.textContent = "Converting...";
  document.getElementById("status").textContent = "";

  try {
    const resp = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, multi: true })
    });
    const data = await resp.json();
    if (!resp.ok) { document.getElementById("status").textContent = data.error || "Error"; return }

    // Render 3-tone results
    const results = document.getElementById("results");
    results.innerHTML = `
      <div class="result-card bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 class="text-xs font-semibold text-primary uppercase tracking-wide mb-2">👔 Professional</h3>
        <p class="text-sm leading-relaxed text-gray-700">${escapeHtml(data.professional || "N/A")}</p>
        <button class="mt-3 text-xs text-primary font-medium" onclick="copyText(this, '${escapeAttr(data.professional || "")}')">📋 Copy</button>
      </div>
      <div class="result-card bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 class="text-xs font-semibold text-primary uppercase tracking-wide mb-2">🤝 Polite</h3>
        <p class="text-sm leading-relaxed text-gray-700">${escapeHtml(data.polite || "N/A")}</p>
        <button class="mt-3 text-xs text-primary font-medium" onclick="copyText(this, '${escapeAttr(data.polite || "")}')">📋 Copy</button>
      </div>
      <div class="result-card bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 class="text-xs font-semibold text-primary uppercase tracking-wide mb-2">💪 Confident</h3>
        <p class="text-sm leading-relaxed text-gray-700">${escapeHtml(data.confident || "N/A")}</p>
        <button class="mt-3 text-xs text-primary font-medium" onclick="copyText(this, '${escapeAttr(data.confident || "")}')">📋 Copy</button>
      </div>`;
    document.getElementById("resultsPreview").classList.remove("hidden");
    document.getElementById("status").textContent = "Done!";
  } catch (e) {
    document.getElementById("status").textContent = "Network error. Please try again.";
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Convert Tone";
  }
}

function clearAll() {
  document.getElementById("inputText").value = "";
  document.getElementById("results").innerHTML = `{{RESULT_PLACEHOLDER}}`;
  document.getElementById("status").textContent = "";
}

function escapeHtml(s) { return (s || "").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeAttr(s) { return (s || "").replace(/'/g,"\\'").replace(/"/g,'&quot;'); }
function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = orig; }, 1500);
  });
}
