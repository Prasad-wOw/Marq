/* -------------------- Helper Functions -------------------- */
function saveState(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  function loadState(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } 
  
  /* -------------------- Clock -------------------- */
  function updateClock() {
    const now = new Date();
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    let [time, amPm] = now.toLocaleTimeString("en-US", options).split(" ");
    document.getElementById("clock").innerHTML = `${time}<span class="am-pm">${amPm}</span>`;
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  /* -------------------- Wallpaper (Custom Upload) -------------------- */
  // Preloaded wallpapers (assumed to be in the parent folder)
const preloadedWallpapers = [
    'wallpaper1.jpg',
    'wallpaper2.jpg',
    'wallpaper3.jpg',
    'wallpaper4.jpg',
    'wallpaper5.jpg'
  ];
  const wallpaperInput = document.getElementById("wallpaperInput");
  function showWallpaperOptions() {
    let modal = document.createElement("div");
    modal.id = "wallpaperModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.29)";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "10000";
    
    let container = document.createElement("div");
    container.style.background = "rgba(44, 42, 42, 0.99)";
    container.style.padding = "20px";
    container.style.borderRadius = "10px";
    container.style.textAlign = "center";
    container.style.maxWidth = "90%";
    
    let title = document.createElement("h3");
    title.textContent = "Select Theme";
    container.appendChild(title);
    
    let preloadedContainer = document.createElement("div");
    preloadedContainer.style.display = "flex";
    preloadedContainer.style.justifyContent = "center";
    preloadedContainer.style.flexWrap = "wrap";
    preloadedContainer.style.marginTop = "20px";
    preloadedContainer.style.marginBottom = "20px";
    preloadedContainer.style.gap = "10px";
    preloadedWallpapers.forEach(src => {
      let img = document.createElement("img");
      img.src = src;
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.objectFit = "cover";
      img.style.cursor = "pointer";
      img.style.border = "2px solid white";
      img.style.borderRadius = "10px";   
      img.addEventListener("click", function() {
        document.body.style.backgroundImage = `url(${src})`;
        localStorage.setItem("marq_wallpaper", src);
        document.body.removeChild(modal);
      });
      preloadedContainer.appendChild(img);
    });
    container.appendChild(preloadedContainer);
    
    let uploadBtn = document.createElement("button");
    uploadBtn.textContent = "Upload";
    uploadBtn.style.margin = "10px";
    uploadBtn.style.padding = "5px";
    uploadBtn.style.borderRadius = "5px";
    uploadBtn.addEventListener("click", function() {
      wallpaperInput.click();
    });
    container.appendChild(uploadBtn);
    
    let reloadBtn = document.createElement("button");
    reloadBtn.textContent = "Random";
    reloadBtn.style.margin = "10px";
    reloadBtn.style.padding = "5px";
    reloadBtn.style.borderRadius = "5px";
    reloadBtn.addEventListener("click", function() {
      let randomUrl = "https://picsum.photos/1920/1080?random=" + Date.now();
      document.body.style.backgroundImage = `url(${randomUrl})`;
      localStorage.setItem("marq_wallpaper", randomUrl);
    });
    container.appendChild(reloadBtn);
    
    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.margin = "10px";
    closeBtn.style.padding = "5px";
    closeBtn.style.background = "red";
    closeBtn.style.color = "white";
    closeBtn.style.borderRadius = "5px";
    closeBtn.addEventListener("click", function() {
      document.body.removeChild(modal);
    });
    container.appendChild(closeBtn);
    
    modal.appendChild(container);
    document.body.appendChild(modal);
  }
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
  document.getElementById("changeWallpaperBtn").addEventListener("click", showWallpaperOptions);
  
  /* -------------------- Search Engines -------------------- */
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
        saveToCloud(); // Ensure the new engine is saved to the cloud
      } catch (err) {
        alert("Invalid URL");
      }
    }
  });
  
  /* -------------------- Context Menu -------------------- */
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
  
  /* -------------------- Folder (Tabs) Management -------------------- */
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
  
  /* -------------------- Bookmark Management -------------------- */
  const bookmarkContentEl = document.getElementById("bookmarkContent");
/**
 * Renders the bookmarks for the active folder.
 * For the "Tools" folder, it shows a dedicated tools panel.
 * For other folders, each bookmark is rendered with its favicon (with fallback)
 * and a responsive name that uses ellipsis if too long.
 */
function renderBookmarks() {
    const folder = folders.find(f => f.id === activeFolderId);
    if (!folder) return;
  
    // If the active folder is "Tools", render the tools panel.
    if (folder.name === "Tools") {
        bookmarkContentEl.innerHTML = `
        <div class="tools-panel">
          <div class="tool-item todo-list">
            <h3>To‑Do List</h3>
            <ul id="todoItems"></ul>
            <input type="text" id="todoInput" placeholder="Add a task...">
            <button id="addTodo">➕</button>
          </div>
          <div class="tool-item pomodoro-timer">
            <h3>Pomodoro Timer</h3>
            <p id="pomodoroTime">25:00</p>
            <button id="startPomodoro" class="focus">Focus</button>
          </div>
      `;
      initTodoList();
      initPomodoroTimer();
      initCalendar();
      return;
    }
    // Clear previous bookmarks.
    bookmarkContentEl.innerHTML = '';
  
    // Render each bookmark.
    folder.bookmarks.forEach((bm, index) => {
      const item = document.createElement('div');
      item.className = 'bookmark-item';
  
      // Create the image element for the favicon.
      const img = document.createElement('img');
      img.src = bm.icon;
      img.alt = bm.name;
      img.title = bm.name;
      // Fallback: if the favicon fails to load, use an inline SVG star icon.
      img.onerror = function() {
        this.onerror = null; // Prevent infinite loop if fallback fails.
        this.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20576%20512%27%3E%3Cpath%20fill=%27%23FFC107%27%20d=%27M287.9%2017.8L354%20150.2l145.3%2021.3c26.2%203.8%2036.7%2036%2017.7%2054.6L423%20319.3l29.2%20170.6c4.5%2026.2-23.1%2046-46.4%2033.7L288%20439.6%20270.2%20523.6c-7.6%2026.3-39.6%2029.6-46.4%203.7L205%20319.3%2080%20254.7c-19-18.7-8.5-50.8%2017.7-54.6l145.3-21.3L287.9%2017.8z%27%3E%3C/path%3E%3C/svg%3E";
      };
  
      // Create a span for the bookmark name.
      const nameSpan = document.createElement('span');
      nameSpan.className = 'bookmark-name';
      // Display the full name and let CSS handle overflow responsively.
      nameSpan.innerText = bm.name;
      nameSpan.title = bm.name;
      // Inline styles for responsiveness with ellipsis.
      nameSpan.style.display = 'block';
      nameSpan.style.maxWidth = '50px';
      nameSpan.style.whiteSpace = 'nowrap';
      nameSpan.style.overflow = 'hidden';
      nameSpan.style.textOverflow = 'ellipsis';
  
      // Append the image and name to the bookmark item.
      item.appendChild(img);
      item.appendChild(nameSpan);
  
      // Clicking the item opens the bookmark URL in a new tab.
      item.onclick = () => window.open(bm.url, '_blank');
  
      // Right-clicking shows the context menu for editing/deleting.
      item.oncontextmenu = (e) => {
        e.preventDefault();
        showContextMenu(e, 'bookmark', index, bm, folder.id);
      };
  
      bookmarkContentEl.appendChild(item);
    });
  
    // Create and append the "Add Bookmark" button.
    const addBtn = document.createElement('button');
    addBtn.className = 'bookmark-item add-bookmark';
    addBtn.innerHTML = `<span style="font-size:1.8rem;">➕</span><span>Add</span>`;
    addBtn.onclick = showBookmarkPopup;
    bookmarkContentEl.appendChild(addBtn);
  
    // Save the updated folders state.
    saveState('marq_folders', folders);
  }
  
  /**
   * Displays a centered popup for adding a new bookmark.
   * Ensures any existing popup is removed before creating a new one.
   */
  function showBookmarkPopup() {
    // Remove any existing popup to avoid duplicates.
    const existingPopup = document.querySelector('.bookmark-popup');
    if (existingPopup) {
      document.body.removeChild(existingPopup);
      return;
    }
  
    // Create the popup container.
    const popup = document.createElement('div');
    popup.className = 'bookmark-popup';
    popup.innerHTML = `
      <input type="text" id="popupBookmarkName" placeholder="Bookmark Name" />
      <input type="text" id="popupBookmarkUrl" placeholder="Bookmark URL" />
      <button id="popupAddBtn">Add</button>
      <button id="popupCancelBtn">Cancel</button>
    `;
    document.body.appendChild(popup);
  
    // Position the popup at the center of the bookmark content area.
    const rect = bookmarkContentEl.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2 - 110) + 'px';
    popup.style.top = (rect.top + rect.height / 2 - 50) + 'px';
  
    // Handler for the "Add" button.
    document.getElementById('popupAddBtn').onclick = () => {
      const name = document.getElementById('popupBookmarkName').value.trim();
      const url = document.getElementById('popupBookmarkUrl').value.trim();
      if (name && url) {
        try {
          // Derive the favicon URL.
          const icon = new URL(url).origin + '/favicon.ico';
          const folder = folders.find(f => f.id === activeFolderId);
          folder.bookmarks.push({ name, url, icon });
          renderBookmarks();
          document.body.removeChild(popup);
        } catch (err) {
          alert('Invalid URL');
        }
      } else {
        alert('Please fill in both fields.');
      }
    };
  
    // Handler for the "Cancel" button.
    document.getElementById('popupCancelBtn').onclick = () => {
      document.body.removeChild(popup);
    };
  }
    
  
  /* -------------------- Firebase Integration for Sync and Authentication -------------------- */
  
  // Firebase Configuration (replace with your actual config)
  const firebaseConfig = {
    apiKey: "AIzaSyBQDnT-C5dYL3abyWUqxvSRBneb7wnANlU",
    authDomain: "marq-bookmark-manager.firebaseapp.com",
    projectId: "marq-bookmark-manager",
    storageBucket: "marq-bookmark-manager.firebasestorage.app",
    messagingSenderId: "558718436878",
    appId: "1:558718436878:web:a4324c4e81ee0bfea55e5f",
    measurementId: "G-LQ9P67E5GV"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  firebase.auth().onAuthStateChanged(user => {
    const bar = document.getElementById('bar');
    if (user) {
        // User is signed in
        const userName = user.displayName || "Explorer";
        bar.textContent = `Hey ${userName}, Let's Marq..`;
        syncUserData(user).then(() => {
            initTodoList();
        });
    } else {
        // No user is signed in
        bar.textContent = "Hey, Let's Marq..";
        resetToDefault();
    }
});
  /* ----- Function to Reset the UI to Default State on Logout ----- */
  function resetToDefault() {
      // Clear localStorage so no previous user data lingers
      localStorage.removeItem("marq_folders");
      localStorage.removeItem("marq_activeFolderId");
      localStorage.removeItem("marq_customEngines");
      // Reset in-memory variables to default values
      folders = [
        { id: 1, name: "Home", bookmarks: [] },
        { id: 2, name: "Work", bookmarks: [] },
        { id: 3, name: "Tools", bookmarks: [] }
      ];
      activeFolderId = 1;
      customEngines = [];
      // Re-render UI
      renderTabs();
      renderBookmarks();
      renderEngines();
  }
  
  /* ----- User Icon Creation & Authentication Handling ----- */
  let userIcon = document.getElementById("userIcon");
  if (!userIcon) {
      userIcon = document.createElement("div");
      userIcon.id = "userIcon";
      userIcon.innerHTML = "<img src='user.svg' style='width:30px; height:30px;'>";
      userIcon.style.position = "fixed";
      userIcon.style.top = "30px";
      userIcon.style.right = "30px";
      userIcon.style.borderRadius = "20px";
      userIcon.style.background = "rgba(242, 219, 15, 0.43)";
      userIcon.style.cursor = "pointer";
      userIcon.style.zIndex = "1000";
      document.body.appendChild(userIcon);
    }


let profileModal = null;
let loginModal = null;

userIcon.addEventListener("click", () => {
    if (auth.currentUser) {
        if (profileModal) {
            document.body.removeChild(profileModal);
            profileModal = null;
        } else {
            showUserProfile();
        }
    } else {
        if (loginModal) {
            document.body.removeChild(loginModal);
            loginModal = null;
        } else {
            showLoginOptions();
        }
    }
});

function showLoginOptions() {
    loginModal = document.createElement("div");
    loginModal.id = "loginModal";
    loginModal.style.position = "fixed";
    loginModal.style.top = "0";
    loginModal.style.left = "0";
    loginModal.style.width = "100%";
    loginModal.style.height = "100%";
    loginModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    loginModal.style.display = "flex";
    loginModal.style.alignItems = "center";
    loginModal.style.justifyContent = "center";
    loginModal.innerHTML = `
        <div style="background:#fefae0; padding:20px; border-radius:5px; text-align:center; color:black; min-width:300px;">
            <h2 style="margin-bottom: 50px;">Login to Marq</h2>
            <br>
            <button id="emailLoginBtn">Login with Email</button>
            <br>
            <button id="googleLoginBtn">Login with Google</button>
            <br>
            <button id="closeLoginModal" style="margin-top:20px;">Cancel</button>
        </div>
    `;
    document.body.appendChild(loginModal);
    document.getElementById("googleLoginBtn").onclick = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(result => {
                syncUserData(result.user);
                document.body.removeChild(loginModal);
                loginModal = null;
            })
            .catch(error => {
                console.error(error);
                alert(error.message);
            });
    };
    document.getElementById("emailLoginBtn").onclick = () => {
        loginModal.innerHTML = `
            <div style="background:#fefae0; padding:20px; border-radius:5px; text-align:center; color:black; min-width:300px;">
                <h2>Email Login</h2>
                <input id="loginEmail" type="email" placeholder="Email" style="width:200px; padding:5px; margin:5px;" /> <br>
                <input id="loginPassword" type="password" placeholder="Password" style="width:200px; padding:5px; margin:5px;" /> <br>
                <button id="emailLoginSubmit">Login</button>
                <button id="emailSignupSubmit">Sign Up</button>
                <button id="closeEmailLogin" style="margin-top:10px;">Cancel</button>
            </div>
        `;
        document.getElementById("emailLoginSubmit").onclick = () => {
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(result => {
                    syncUserData(result.user);
                    document.body.removeChild(loginModal);
                    loginModal = null;
                })
                .catch(error => {
                    console.error(error);
                    alert(error.message);
                });
        };
        document.getElementById("emailSignupSubmit").onclick = () => {
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(result => {
                    syncUserData(result.user);
                    document.body.removeChild(loginModal);
                    loginModal = null;
                })
                .catch(error => {
                    console.error(error);
                    alert(error.message);
                });
        };
        document.getElementById("closeEmailLogin").onclick = () => {
            document.body.removeChild(loginModal);
            loginModal = null;
        };
    };
    document.getElementById("closeLoginModal").onclick = () => {
        document.body.removeChild(loginModal);
        loginModal = null;
    };
}
  

  
function showUserProfile() {
    const user = firebase.auth().currentUser;
    if (user) {
        userIcon.innerHTML = `<img src="${user.photoURL || 'user.svg'}" style="width:30px; height:30px; border-radius:50%">`;
        profileModal = document.createElement("div");
        profileModal.id = "profileModal";
        profileModal.style.position = "fixed";
        profileModal.style.top = "0";
        profileModal.style.left = "0";
        profileModal.style.width = "100%";
        profileModal.style.height = "100%";
        profileModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        profileModal.style.display = "flex";
        profileModal.style.alignItems = "center";
        profileModal.style.justifyContent = "center";
        profileModal.innerHTML = `
                <div style="background:rgba(81, 81, 81, 0.93); padding:20px; border-radius:5px; text-align:center; min-width:300px;">
                    <img src="${user.photoURL || 'user.svg'}" style="width:80px; height:80px; border-radius:50%;">
                    <h2 style="margin-bottom:40px; margin-top:20px">${user.displayName || user.email}</h2>
                    <button id="logoutBtn">Logout</button>
                    <button id="closeProfileModal" style="margin-top:10px;">Close</button>
                </div>
            `;
        document.body.appendChild(profileModal);
        document.getElementById("logoutBtn").onclick = () => {
            firebase.auth().signOut();
            // The onAuthStateChanged listener below will trigger resetToDefault()
            document.body.removeChild(profileModal);
            profileModal = null;
        };
        document.getElementById("closeProfileModal").onclick = () => {
            document.body.removeChild(profileModal);
            profileModal = null;
        };
    }
}
  
  function syncUserData(user) {
      const userRef = db.collection("users").doc(user.uid);
      userRef.get().then(doc => {
          if (doc.exists) {
              // Load synced data (expected structure: { folders, searchEngines })
              const data = doc.data();
              if (data.folders) { 
                folders = data.folders; 
                renderTabs(); 
                renderBookmarks(); 
              }
              if (data.searchEngines) { 
                customEngines = data.searchEngines; 
                renderEngines(); 
              }
          } else {
              userRef.set({
                  folders: folders,
                  searchEngines: customEngines
              });
          }
      }).catch(err => console.error(err));
  }
  
  function saveToCloud() {
      const user = firebase.auth().currentUser;
      if (user) {
          const userRef = db.collection("users").doc(user.uid);
          userRef.update({
              folders: folders,
              searchEngines: customEngines
          }).catch(err => console.error(err));
      }
  }
  // Enhance saveState to also update the cloud data
  const originalSaveState = saveState;
  window.saveState = function(key, data) {
      originalSaveState(key, data);
      saveToCloud();
  };
  
  // Listen for auth state changes to update the UI accordingly
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          syncUserData(user);
          userIcon.innerHTML = `<img src="${user.photoURL || 'user.svg'}" style="width:30px; height:30px; border-radius:50%">`;
      } else {
          // On logout, reset the UI to default state
          resetToDefault();
          userIcon.innerHTML = '<img src="user.svg" style="width:30px; height:30px;">';
      }
  });



//   switch toggle
document.getElementById('toggleTabsCheckbox').addEventListener('change', function() {
    const detailsElement = document.querySelector('details.dropdown');
    detailsElement.open = !this.checked;
});



/**************** Tools Tab Functionality ****************/
/* --- To-Do List with Firebase Sync --- */
function initTodoList() {
    const todoItemsEl = document.getElementById("todoItems");
    const todoInput = document.getElementById("todoInput");
    
    // Use a global array to hold tasks; these will be synced with Firebase.
    if (!window.todoTasks) {
      window.todoTasks = [];
    }
    
    function renderTodoList() {
      todoItemsEl.innerHTML = "";
      window.todoTasks.forEach((task, index) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function() {
          window.todoTasks[index].completed = this.checked;
          renderTodoList();
          saveTodoTasks();
        });
        const taskSpan = document.createElement("span");
        taskSpan.className = "todo-task";
        taskSpan.textContent = task.text;
        taskSpan.style.textDecoration = task.completed ? "line-through" : "none";
        taskSpan.style.flex = "1";
        taskSpan.style.marginRight = "10px";
        todoItemsEl.style.maxHeight = "155px"; // Set a max height for the container
        todoItemsEl.style.overflowY = "auto"; // Enable vertical scrolling
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "🗑️"; // Cross mark icon
        deleteBtn.addEventListener("click", function() {
          window.todoTasks.splice(index, 1);
          renderTodoList();
          saveTodoTasks();
        });
        
        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);
        todoItemsEl.appendChild(li);
      });
    }
    
    function addTask() {
      const text = todoInput.value.trim();
      if (text !== "") {
        window.todoTasks.push({ text: text, completed: false });
        todoInput.value = "";
        renderTodoList();
        saveTodoTasks();
      }
    }
    
    document.getElementById("addTodo").addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        addTask();
      }
    });
    
    loadTodoTasks();
    renderTodoList();
  }
  
  /* Load to-do tasks from Firebase */
  function loadTodoTasks() {
    const user = firebase.auth().currentUser;
    if (user) {
      const userRef = firebase.firestore().collection("users").doc(user.uid);
      userRef.get().then(doc => {
        if (doc.exists && doc.data().todoTasks) {
          window.todoTasks = doc.data().todoTasks;
          // Re-render if the Tools Tab is active
          const todoItemsEl = document.getElementById("todoItems");
          if (todoItemsEl) {
            const event = new Event("todoTasksLoaded");
            document.dispatchEvent(event);
          }
        }
      }).catch(error => {
        console.error("Error loading todo tasks: ", error);
      });
    }
  }
  
  /* Save to-do tasks to Firebase */
  function saveTodoTasks() {
    const user = firebase.auth().currentUser;
    if (user) {
      const userRef = firebase.firestore().collection("users").doc(user.uid);
      userRef.update({ todoTasks: window.todoTasks })
        .catch(error => console.error("Error saving todo tasks: ", error));
    }
  }
  
  /* --- Pomodoro Timer (Full-Screen Overlay) --- */
function initPomodoroTimer() {
    let pomodoroTime = 25 * 60;
    let pomodoroInterval;
    const pomodoroDisplay = document.getElementById("pomodoroTime");
    const startBtn = document.getElementById("startPomodoro");
    const resetBtn = document.getElementById("resetPomodoro");

    function startTimer() {
        let overlay = document.getElementById("pomodoroOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "pomodoroOverlay";
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "rgb(0, 0, 0)";
            overlay.style.display = "flex";
            overlay.style.flexDirection = "column";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.zIndex = "9999";

            const overlayTimerDisplay = document.createElement("p");
            overlayTimerDisplay.id = "overlayPomodoroTime";
            overlayTimerDisplay.style.fontSize = "5rem";
            overlayTimerDisplay.style.color = "#fff";
            overlay.appendChild(overlayTimerDisplay);

            const overlayResetBtn = document.createElement("button");
            overlayResetBtn.id = "overlayResetPomodoro";
            overlayResetBtn.textContent = "I'm OUT";
            overlayResetBtn.style.color = "red";
            overlayResetBtn.style.fontSize = "1.1rem";
            overlayResetBtn.style.fontWeight = "bold";
            overlayResetBtn.style.borderRadius = "25px";
            overlayResetBtn.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
            overlayResetBtn.style.padding = "10px 20px";
            overlayResetBtn.style.marginTop = "20px";
            overlay.appendChild(overlayResetBtn);

            document.body.appendChild(overlay);

            overlayResetBtn.addEventListener("click", function() {
                clearInterval(pomodoroInterval);
                pomodoroTime = 25 * 60;
                overlay.remove();
                pomodoroDisplay.textContent = "25:00";
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            });
        }

        const overlayTimerDisplay = document.getElementById("overlayPomodoroTime");
        pomodoroInterval = setInterval(() => {
            let minutes = Math.floor(pomodoroTime / 60);
            let seconds = pomodoroTime % 60;
            overlayTimerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            if (pomodoroTime > 0) {
                pomodoroTime--;
            } else {
                clearInterval(pomodoroInterval);
            }
        }, 1000);

        // Request full screen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    }

    startBtn.addEventListener("click", function() {
        startTimer();
    });

    resetBtn.addEventListener("click", function() {
        clearInterval(pomodoroInterval);
        pomodoroTime = 25 * 60;
        pomodoroDisplay.textContent = "25:00";
        let overlay = document.getElementById("pomodoroOverlay");
        if (overlay) overlay.remove();
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });
}
  
 // Feature Modal Functionality
document.addEventListener("DOMContentLoaded", function() {
    const featureModal = document.getElementById("featureModal");
    const openFeatureModal = document.getElementById("openFeatureModal");
    const closeFeatureModal = document.getElementById("closeFeatureModal");
    const closeModalButton = document.querySelector(".close-btn");

    // Show modal
    openFeatureModal.addEventListener("click", () => {
        featureModal.style.display = "flex";
    });

    // Close modal
    closeFeatureModal.addEventListener("click", () => {
        featureModal.style.display = "none";
    });
    
    closeModalButton.addEventListener("click", () => {
        featureModal.style.display = "none";
    });

    // Close modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target === featureModal) {
            featureModal.style.display = "none";
        }
    });
});

  /* -------------------- End of Script -------------------- */
  
