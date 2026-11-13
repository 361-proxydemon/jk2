
const SplashE = document.getElementById("splash");
if (SplashE) SplashE.textContent = "credits to J.";

function updateClock() {
  const now = new Date();
  const time = document.getElementById("clock-time");
  const date = document.getElementById("clock-date");
  if (time) time.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (date) date.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
updateClock();
setInterval(updateClock, 1000);

const shortcutList = document.getElementById("shortcut-list");
const shortcutKey = "ccisd-home-shortcuts";
function readShortcuts() {
  try { return JSON.parse(localStorage.getItem(shortcutKey) || "[]"); }
  catch { return []; }
}
function renderShortcuts() {
  if (!shortcutList) return;
  shortcutList.replaceChildren();
  readShortcuts().forEach((shortcut, index) => {
    const link = document.createElement("a");
    link.className = "shortcut-item";
    link.href = shortcut.url;
    link.title = shortcut.name;
    link.innerHTML = '<span class="shortcut-icon"><i class="fa-solid fa-link"></i></span>';
    const label = document.createElement("span");
    label.textContent = shortcut.name;
    const remove = document.createElement("button");
    remove.className = "shortcut-remove";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${shortcut.name}`);
    remove.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const items = readShortcuts();
      items.splice(index, 1);
      localStorage.setItem(shortcutKey, JSON.stringify(items));
      renderShortcuts();
    });
    link.append(label, remove);
    shortcutList.appendChild(link);
  });
}

document.getElementById("add-shortcut")?.addEventListener("click", () => {
  const name = prompt("Shortcut name:");
  if (!name?.trim()) return;
  let url = prompt("Website URL:");
  if (!url?.trim()) return;
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) throw new Error("Invalid protocol");
    const items = readShortcuts();
    if (items.length >= 8) { alert("You can add up to 8 shortcuts."); return; }
    items.push({ name: name.trim().slice(0, 24), url: parsed.href });
    localStorage.setItem(shortcutKey, JSON.stringify(items));
    renderShortcuts();
  } catch { alert("Please enter a valid website URL."); }
});
renderShortcuts();


