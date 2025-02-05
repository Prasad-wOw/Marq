// -------------------- Helper Functions --------------------
function saveState(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadState(key, defaultValue) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
} 

// -------------------- Clock --------------------
function updateClock() {
  const now = new Date();
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  let [time, amPm] = now.toLocaleTimeString("en-US", options).split(" ");
  document.getElementById("clock").innerHTML = `${time}<span class="am-pm">${amPm}</span>`;
}
setInterval(updateClock, 1000);
updateClock();

// -------------------- Wallpaper (Custom Upload) --------------------


// Load wallpaper from localStorage
const wallpaperInput = document.getElementById("wallpaperInput");
document.getElementById("changeWallpaperBtn").addEventListener("click", () => {
  wallpaperInput.click();
});
wallpaperInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const dataUrl = ev.target.result;
      document.body.style.backgroundImage = `url(${dataUrl})`;
      localStorage.setItem("marq_wallpaper", dataUrl);
    };
    reader.readAsDataURL(file);
  }
});

const savedWallpaper = localStorage.getItem("marq_wallpaper");
if (savedWallpaper) {
  document.body.style.backgroundImage = `url(${savedWallpaper})`;
}

// -------------------- Search Engines --------------------
const defaultEngines = [
  { name: "Google", url: "https://www.google.com/search?q=", icon: "https://www.google.com/favicon.ico" },
  { name: "Bing", url: "https://www.bing.com/search?q=", icon: "https://www.bing.com/favicon.ico" },
  { name: "Wiki", url: "https://en.wikipedia.org/wiki/", icon: "https://en.wikipedia.org/favicon.ico" },
  { name: "YouTube", url: "https://www.youtube.com/results?search_query=", icon: "https://www.youtube.com/favicon.ico" }
];
let customEngines = loadState("marq_customEngines", []);
let selectedEngine = defaultEngines[0];

function renderEngines() {
  const container = document.querySelector(".engine-container");
  container.innerHTML = "";
  const allEngines = [...defaultEngines, ...customEngines];
  allEngines.forEach((engine) => {
    const btn = document.createElement("button");
    btn.className = "engine-btn";
    if (engine.url === selectedEngine.url) btn.classList.add("selected");
    btn.innerHTML = `<img src="${engine.icon}" alt="${engine.name}"><span>${engine.name}</span>`;
    btn.onclick = () => {
      selectedEngine = engine;
      renderEngines();
    };
    // Right-click for custom engines only
    btn.oncontextmenu = (e) => {
      e.preventDefault();
      if (allEngines.indexOf(engine) >= defaultEngines.length) {
        showContextMenu(e, "engine", customEngines.indexOf(engine), engine);
      }
    };
    container.appendChild(btn);
  });
}
renderEngines();

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("query").value;
  if (query) window.open(selectedEngine.url + encodeURIComponent(query), "_blank");
});
document.getElementById("query").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = document.getElementById("query").value;
    if (query) window.open(selectedEngine.url + encodeURIComponent(query), "_blank");
  }
});

// Engine Settings Panel
const settingsBtn = document.getElementById("settingsBtn");
const engineSettingsPanel = document.getElementById("engineSettings");
const addEngineBtn = document.getElementById("addEngineBtn");
const newEngineNameInput = document.getElementById("newEngineName");
const newEngineUrlInput = document.getElementById("newEngineUrl");

settingsBtn.addEventListener("click", () => {
  engineSettingsPanel.classList.toggle("hidden");
});
addEngineBtn.addEventListener("click", () => {
  const name = newEngineNameInput.value.trim();
  const url = newEngineUrlInput.value.trim();
  if (name && url) {
    try {
      const icon = new URL(url).origin + "/favicon.ico";
      customEngines.push({ name, url, icon });
      newEngineNameInput.value = "";
      newEngineUrlInput.value = "";
      engineSettingsPanel.classList.add("hidden");
      saveState("marq_customEngines", customEngines);
      renderEngines();
    } catch (err) {
      alert("Invalid URL");
    }
  }
});

// -------------------- Context Menu --------------------
const contextMenuEl = document.getElementById("contextMenu");
function showContextMenu(e, type, index, item, parentId = null) {
  contextMenuEl.innerHTML = "";
  ["edit", "delete"].forEach((option) => {
    const btn = document.createElement("button");
    btn.innerText = option.charAt(0).toUpperCase() + option.slice(1);
    btn.onclick = () => {
      handleContextMenuOption(option, type, index, item, parentId);
    };
    contextMenuEl.appendChild(btn);
  });
  contextMenuEl.style.top = e.pageY + "px";
  contextMenuEl.style.left = e.pageX + "px";
  contextMenuEl.classList.remove("hidden");
}
function handleContextMenuOption(option, type, index, item, parentId) {
  if (type === "engine") {
    if (option === "edit") {
      const newName = prompt("Enter new engine name:", item.name);
      const newUrl = prompt("Enter new engine URL:", item.url);
      if (newName && newUrl) {
        try {
          const icon = new URL(newUrl).origin + "/favicon.ico";
          customEngines[index] = { name: newName, url: newUrl, icon };
          saveState("marq_customEngines", customEngines);
          renderEngines();
        } catch (err) {
          alert("Invalid URL");
        }
      }
    } else if (option === "delete") {
      customEngines.splice(index, 1);
      saveState("marq_customEngines", customEngines);
      renderEngines();
    }
  } else if (type === "folder") {
    if (option === "edit") {
      const newName = prompt("Enter new folder name:", item.name);
      if (newName) {
        const folder = folders.find(f => f.id === item.id);
        if (folder) folder.name = newName;
        saveState("marq_folders", folders);
        renderTabs();
      }
    } else if (option === "delete") {
      folders = folders.filter(f => f.id !== item.id);
      saveState("marq_folders", folders);
      if (activeFolderId === item.id && folders.length > 0) activeFolderId = folders[0].id;
      renderTabs();
      renderBookmarks();
    }
  } else if (type === "bookmark") {
    const folder = folders.find(f => f.id === parentId);
    if (folder) {
      if (option === "edit") {
        const newName = prompt("Enter new bookmark name:", item.name);
        const newUrl = prompt("Enter new bookmark URL:", item.url);
        if (newName && newUrl) {
          try {
            const icon = new URL(newUrl).origin + "/favicon.ico";
            folder.bookmarks[index] = { name: newName, url: newUrl, icon };
            saveState("marq_folders", folders);
            renderBookmarks();
          } catch (err) {
            alert("Invalid URL");
          }
        }
      } else if (option === "delete") {
        folder.bookmarks.splice(index, 1);
        saveState("marq_folders", folders);
        renderBookmarks();
      }
    }
  }
  contextMenuEl.classList.add("hidden");
}

window.addEventListener("click", () => {
  contextMenuEl.classList.add("hidden");
});

// -------------------- Folder (Tabs) Management --------------------
let folders = loadState("marq_folders", [
  { id: 1, name: "Home", bookmarks: [] },
  { id: 2, name: "Work", bookmarks: [] },
  { id: 3, name: "Tools", bookmarks: [] }
]);
let activeFolderId = loadState("marq_activeFolderId", 1);
const tabsContainer = document.getElementById("tabs");
const addTabBtn = document.getElementById("addTabBtn");
const newFolderContainer = document.getElementById("newFolderContainer");
const newFolderNameInput = document.getElementById("newFolderName");
const createFolderBtn = document.getElementById("createFolderBtn");
const cancelFolderBtn = document.getElementById("cancelFolderBtn");

function renderTabs() {
  tabsContainer.innerHTML = "";
  folders.forEach(folder => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    if (folder.id === activeFolderId) btn.classList.add("active");
    btn.innerText = folder.name;
    btn.onclick = () => {
      activeFolderId = folder.id;
      saveState("marq_activeFolderId", activeFolderId);
      renderTabs();
      renderBookmarks();
    };
    btn.oncontextmenu = (e) => {
      e.preventDefault();
      showContextMenu(e, "folder", null, folder);
    };
    tabsContainer.appendChild(btn);
  });
}
renderTabs();

addTabBtn.addEventListener("click", () => {
  newFolderContainer.classList.remove("hidden");
});
createFolderBtn.addEventListener("click", () => {
  const name = newFolderNameInput.value.trim();
  if (name) {
    const newFolder = { id: Date.now(), name, bookmarks: [] };
    folders.push(newFolder);
    activeFolderId = newFolder.id;
    newFolderNameInput.value = "";
    newFolderContainer.classList.add("hidden");
    saveState("marq_folders", folders);
    saveState("marq_activeFolderId", activeFolderId);
    renderTabs();
    renderBookmarks();
  }
});
cancelFolderBtn.addEventListener("click", () => {
  newFolderContainer.classList.add("hidden");
});

// -------------------- Bookmark Management --------------------
const bookmarkContentEl = document.getElementById("bookmarkContent");

function renderBookmarks() {
  // If Tools tab is active, render tools panel
  const folder = folders.find(f => f.id === activeFolderId);
  if (!folder) return;
  if (folder.name === "Tools") {
    bookmarkContentEl.innerHTML = `
      <div class="tools-panel">
        <div class="tool-item">
          <h3>To‑Do List</h3>
          <textarea id="todoList" placeholder="Enter tasks here..."></textarea>
        </div>
        <div class="tool-item">
          <h3>Pomodoro Timer</h3>
          <p>(Coming Soon)</p>
        </div>
        <div class="tool-item">
          <h3>Calendar</h3>
          <p>(Coming Soon)</p>
        </div>
      </div>
    `;
    return;
  }

  // Otherwise, render bookmarks for the folder
  bookmarkContentEl.innerHTML = "";
  folder.bookmarks.forEach((bm, index) => {
    const item = document.createElement("div");
    item.className = "bookmark-item";
    const nameSpan = document.createElement("span");
    nameSpan.className = "bookmark-name";
    nameSpan.innerText = bm.name.length > 8 ? bm.name.substring(0, 8) + "..." : bm.name;
    nameSpan.title = bm.name;
    item.innerHTML = `<img src="${bm.icon}" alt="${bm.name}" title="${bm.name}">`;
    item.appendChild(nameSpan);
    item.onclick = () => window.open(bm.url, "_blank");
    item.oncontextmenu = (e) => {
      e.preventDefault();
      showContextMenu(e, "bookmark", index, bm, folder.id);
    };
    bookmarkContentEl.appendChild(item);
  });
  // Render Add Bookmark Icon (rounded & 60% transparent) within workspace
  const addBtn = document.createElement("button");
  addBtn.className = "bookmark-item add-bookmark";
  addBtn.innerHTML = `<span style="font-size:1.8rem;">➕</span><span>Add</span>`;
  addBtn.onclick = showBookmarkPopup;
  bookmarkContentEl.appendChild(addBtn);
  saveState("marq_folders", folders);
}
renderBookmarks();

// Inline Popup for Adding Bookmark
function showBookmarkPopup() {
  const existingPopup = document.querySelector(".bookmark-popup");
  if (existingPopup) {
    document.body.removeChild(existingPopup);
    return;
  }
  let popup = document.createElement("div");
  popup.className = "bookmark-popup";
  popup.innerHTML = `
    <input type="text" id="popupBookmarkName" placeholder="Bookmark Name" />
    <input type="text" id="popupBookmarkUrl" placeholder="Bookmark URL" />
    <button id="popupAddBtn">Add</button>
    <button id="popupCancelBtn">Cancel</button>
  `;
  document.body.appendChild(popup);
  // Position popup at center of bookmarkContent
  const rect = bookmarkContentEl.getBoundingClientRect();
  popup.style.left = rect.left + rect.width / 2 - 110 + "px";
  popup.style.top = rect.top + rect.height / 2 - 50 + "px";

  document.getElementById("popupAddBtn").onclick = () => {
    const name = document.getElementById("popupBookmarkName").value.trim();
    const url = document.getElementById("popupBookmarkUrl").value.trim();
    if (name && url) {
      try {
        const icon = new URL(url).origin + "/favicon.ico";
        const folder = folders.find(f => f.id === activeFolderId);
        folder.bookmarks.push({ name, url, icon });
        renderBookmarks();
        document.body.removeChild(popup);
      } catch (err) {
        alert("Invalid URL");
      }
    }
  };
  document.getElementById("popupCancelBtn").onclick = () => {
    document.body.removeChild(popup);
  };
}

// -------------------- End of Script --------------------
