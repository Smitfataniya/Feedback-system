const API = "http://localhost:5000/feedback";
const form = document.getElementById("feedbackForm");
const statusEl = document.getElementById("status");
const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await addFeedback();
});

function showStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

async function addFeedback() {
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !message) {
    showStatus("Please enter both your name and feedback before submitting.", "error");
    return;
  }

  submitButton.disabled = true;
  showStatus("Sending feedback…");

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });

    if (!response.ok) {
      throw new Error("Failed to submit feedback");
    }

    form.reset();
    showStatus("Thanks! Your feedback was submitted.", "success");
    await loadFeedback();
  } catch (error) {
    console.error(error);
    showStatus("Unable to submit feedback. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function loadFeedback() {
  const list = document.getElementById("feedbackList");
  list.innerHTML = `<div class="empty-state">Loading feedback…</div>`;

  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error("Failed to load feedback");
    }

    const data = await response.json();

    if (!data.length) {
      list.innerHTML = `<div class="empty-state">No feedback yet. Be the first to leave a comment!</div>`;
      return;
    }

    list.innerHTML = data.map((f) => `
      <article class="feedback-card">
        <div>
          <h3>${escapeHtml(f.name)}</h3>
          <p>${escapeHtml(f.message)}</p>
        </div>
        <button type="button" onclick="deleteFeedback('${f._id}')">Delete</button>
      </article>
    `).join("");
  } catch (error) {
    console.error(error);
    list.innerHTML = `<div class="empty-state">Unable to load feedback. Please refresh the page.</div>`;
  }
}

async function deleteFeedback(id) {
  try {
    const response = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to delete feedback");
    }
    await loadFeedback();
    showStatus("Feedback deleted.", "success");
  } catch (error) {
    console.error(error);
    showStatus("Unable to delete feedback. Please try again.", "error");
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

loadFeedback();