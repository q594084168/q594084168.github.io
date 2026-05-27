/**
 * ToneModifier — Frontend Logic
 * 
 * 使用前请修改 WORKER_URL 为你的 Cloudflare Worker 地址。
 */
const WORKER_URL = "https://tone-modifier.594084168.workers.dev";

const inputEl = document.getElementById("inputText");
const btnEl = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const formalEl = document.getElementById("resFormal");
const assertiveEl = document.getElementById("resAssertive");
const conciseEl = document.getElementById("resConcise");

async function processText() {
  const text = inputEl.value.trim();
  if (!text) {
    showStatus("Please enter some text first.", "error");
    return;
  }

  btnEl.disabled = true;
  btnEl.textContent = "Processing...";
  showStatus("Generating three tone variations...", "");
  resultsEl.classList.remove("visible");

  try {
    const resp = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      showStatus(data.error || "Request failed", "error");
      return;
    }

    formalEl.textContent = data.formal || "N/A";
    assertiveEl.textContent = data.assertive || "N/A";
    conciseEl.textContent = data.concise || "N/A";
    resultsEl.classList.add("visible");
    showStatus("Done! Click any card's Copy button to use the text.", "success");
  } catch (e) {
    showStatus("Network error. Please check your connection and try again.", "error");
  } finally {
    btnEl.disabled = false;
    btnEl.textContent = "Transform Tone ✨";
  }
}

function showStatus(msg, cls) {
  statusEl.textContent = msg;
  statusEl.className = "status " + (cls || "");
}

function copyCard(cardId) {
  const el = document.getElementById(cardId);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const btn = el.parentElement.querySelector(".copy-btn");
    const original = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
}
