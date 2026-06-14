/* ==========================================
   Zroom Website Elevator Redesign Logical Script
   ========================================== */

// 1. Companion Pets Database
const companionsData = [
  {
    id: "orange_tabby",
    name: "經典橘喵",
    emoji: "🐱",
    cost: "免費預設",
    category: ["cat", "home"],
    skill: "被動工作收益累積時間縮短 15% (加速金幣獲取)。"
  },
  {
    id: "tuxedo",
    name: "賓士酷喵",
    emoji: "🐈‍⬛",
    cost: "1,500 🪙",
    category: ["cat", "home"],
    skill: "主動專注首次分心不扣心情，分心寬限 (Grace) 額外增加 60 秒。"
  },
  {
    id: "calico",
    name: "三花萌喵",
    emoji: "🌸",
    cost: "2,000 🪙",
    category: ["cat", "home"],
    skill: "主動專注成功時，有 20% 機率獲得雙倍金幣報酬。"
  },
  {
    id: "shiba",
    name: "溫馨柴柴",
    emoji: "🐶",
    cost: "2,500 🪙",
    category: ["home"],
    skill: "餵食食物時，獲得的心情值回復效果提高 50%。"
  },
  {
    id: "rabbit",
    name: "溫馨小白兔",
    emoji: "🐰",
    cost: "3,000 🪙",
    category: ["home", "forest"],
    skill: "被動 AFK 閒置判定時間延長至 300 秒，更不容易判定為斷線。"
  },
  {
    id: "bear",
    name: "頑皮小棕熊",
    emoji: "🐻",
    cost: "3,500 🪙",
    category: ["forest"],
    skill: "專注中途放棄或失敗時，小夥伴所扣除的心情值減半。"
  },
  {
    id: "penguin",
    name: "呆萌小企鵝",
    emoji: "🐧",
    cost: "4,000 🪙",
    category: ["cold"],
    skill: "專注品質分數額外 +5，幫助解鎖更多進階專注成就。"
  },
  {
    id: "hamster",
    name: "萌萌金絲鼠",
    emoji: "🐹",
    cost: "4,500 🪙",
    category: ["home"],
    skill: "商店購買所有商品（家具、壁紙、地板等）享 9 折優惠。"
  },
  {
    id: "fox",
    name: "俏皮小狐狸",
    emoji: "🦊",
    cost: "5,000 🪙",
    category: ["forest"],
    skill: "分心寬限倒數中，每一秒有 15% 機率不減少寬限時間。"
  },
  {
    id: "raccoon",
    name: "慵懶小浣熊",
    emoji: "🦝",
    cost: "5,500 🪙",
    category: ["forest"],
    skill: "倉庫家具回收/賣出價格，從原本 of 50% 提高至 70%。"
  },
  {
    id: "lion",
    name: "溫馨小獅子",
    emoji: "🦁",
    cost: "6,000 🪙",
    category: ["savanna"],
    skill: "主動專注基礎收益提升，每分鐘金幣從 2 個增加至 2.4 個。"
  },
  {
    id: "deer",
    name: "森林小斑比",
    emoji: "🦌",
    cost: "6,500 🪙",
    category: ["forest"],
    skill: "小夥伴離家後的召回專注時間，由 5 分鐘縮短為 3 分鐘。"
  },
  {
    id: "koala",
    name: "呆萌無尾熊",
    emoji: "🐨",
    cost: "7,000 🪙",
    category: ["forest"],
    skill: "放在後台的狀態下，每小時自動回復 1 點心情值。"
  },
  {
    id: "giraffe",
    name: "溫馨長頸鹿",
    emoji: "🦒",
    cost: "7,500 🪙",
    category: ["savanna"],
    skill: "進行 20 分鐘以上專注時，專注品質分數保證不低於 60。"
  },
  {
    id: "panda",
    name: "功夫大貓熊",
    emoji: "🐼",
    cost: "8,000 🪙",
    category: ["forest"],
    skill: "白名單每啟用一款 App，成功金幣 +5% (上限 +50%)。"
  },
  {
    id: "sloth",
    name: "慢活小樹懶",
    emoji: "🦥",
    cost: "8,500 🪙",
    category: ["forest"],
    skill: "45 分鐘以上專注完成時，心情值直接加滿，且額外獲得 50 金幣。"
  }
];

// 2. Roaming Pet AI Class
class RoamingPet {
  constructor(container, avatarId, petName, options = {}) {
    this.container = container;
    this.element = document.createElement("div");
    this.element.className = "roaming-pet idle";
    this.element.innerHTML = `<img src="assets/avatars/${avatarId}.png" alt="${petName}" />`;
    this.container.appendChild(this.element);

    this.bounds = options.bounds || { minX: 15, maxX: 85, minY: 68, maxY: 88 };
    this.minDistance = options.minDistance || 9;
    this.moveDurationRange = options.moveDurationRange || [7, 11];
    this.pauseRange = options.pauseRange || [5000, 9500];
    this.walkChance = options.walkChance ?? 0.32;
    this.collisionInterval = options.collisionInterval || 1600;
    this.collisionCooldown = options.collisionCooldown || 2400;
    this.collisionThreshold = options.collisionThreshold || this.minDistance * 0.92;
    this.collisionNudge = options.collisionNudge || { x: 0.25, y: 0.18 };
    this.collisionTransition = options.collisionTransition || "left 6s ease-out, top 6s ease-out";
    this.sleepEnabled = options.sleepEnabled !== false;
    this.size = options.size || 82;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;

    if (!this.container._roamingPets) this.container._roamingPets = [];
    this.container._roamingPets.push(this);

    const start = options.initialPosition || this.findOpenPosition();
    this.x = start.x;
    this.y = start.y;
    this.element.style.left = `${this.x}%`;
    this.element.style.top = `${this.y}%`;

    this.timer = null;
    this.collisionTimer = null;
    this.lastBumpAt = 0;
    this.particleTimer = null;
    this.state = "idle"; // idle, walking, sleeping
    this.pauseAI = false; // Flag to temporarily disable AI wander (e.g. mouse chase)
    
    // Kick off AI cycle
    this.aiLoop();
    this.startCollisionGuard();
  }

  randomPosition() {
    return {
      x: Math.random() * (this.bounds.maxX - this.bounds.minX) + this.bounds.minX,
      y: Math.random() * (this.bounds.maxY - this.bounds.minY) + this.bounds.minY
    };
  }

  distanceTo(other, position = { x: this.x, y: this.y }) {
    return Math.hypot(position.x - other.x, position.y - other.y);
  }

  findOpenPosition() {
    const pets = (this.container._roamingPets || []).filter(pet => pet !== this);
    let best = this.randomPosition();
    let bestDistance = -1;

    for (let attempt = 0; attempt < 42; attempt += 1) {
      const candidate = this.randomPosition();
      const nearest = pets.reduce((min, pet) => Math.min(min, this.distanceTo(pet, candidate)), Infinity);
      if (nearest >= this.minDistance) return candidate;
      if (nearest > bestDistance) {
        best = candidate;
        bestDistance = nearest;
      }
    }

    return best;
  }

  aiLoop() {
    const nextDuration = Math.random() * (this.pauseRange[1] - this.pauseRange[0]) + this.pauseRange[0];
    this.timer = setTimeout(() => {
      if (!this.pauseAI) {
        this.transitionNextState();
      }
      this.aiLoop();
    }, nextDuration);
  }

  transitionNextState() {
    const rand = Math.random();
    
    if (rand < this.walkChance) {
      // Walking State
      this.state = "walking";
      this.element.className = "roaming-pet";
      
      const target = this.findOpenPosition();
      const duration = Math.random() * (this.moveDurationRange[1] - this.moveDurationRange[0]) + this.moveDurationRange[0];
      this.element.style.transition = `left ${duration}s cubic-bezier(0.33, 1, 0.68, 1), top ${duration}s cubic-bezier(0.33, 1, 0.68, 1)`;
      
      // Flip texture based on direction
      const img = this.element.querySelector("img");
      if (target.x < this.x) {
        img.style.transform = "scaleX(-1)"; // Left
      } else {
        img.style.transform = "scaleX(1)"; // Right
      }
      
      this.x = target.x;
      this.y = target.y;
      this.element.style.left = `${this.x}%`;
      this.element.style.top = `${this.y}%`;
      
    } else if (rand < 0.75) {
      // Idle State
      this.state = "idle";
      this.element.className = "roaming-pet idle";
      
    } else {
      // Sleeping State
      // If it's the 1F Lobby cat (lobbyRoom), force it to idle and prevent sleeping/zzz particles
      if (!this.sleepEnabled || this.container.id === "lobbyRoom") {
        this.state = "idle";
        this.element.className = "roaming-pet idle";
        return;
      }
      this.state = "sleeping";
      this.element.className = "roaming-pet sleeping";
      this.startSleepParticles();
    }
  }

  startCollisionGuard() {
    this.collisionTimer = setInterval(() => {
      if (this.pauseAI) return;

      const neighbor = (this.container._roamingPets || [])
        .filter(pet => pet !== this)
        .find(pet => this.distanceTo(pet) < this.collisionThreshold);

      if (!neighbor) return;

      const now = Date.now();
      if (now - this.lastBumpAt > this.collisionCooldown) {
        this.lastBumpAt = now;
        this.element.classList.remove("bumping");
        void this.element.offsetWidth;
        this.element.classList.add("bumping");
        setTimeout(() => this.element.classList.remove("bumping"), 720);
      }

      const awayX = this.x - neighbor.x || (Math.random() > 0.5 ? 1 : -1);
      const awayY = this.y - neighbor.y || (Math.random() > 0.5 ? 1 : -1);
      const length = Math.hypot(awayX, awayY) || 1;
      this.x = Math.min(this.bounds.maxX, Math.max(this.bounds.minX, this.x + (awayX / length) * this.minDistance * this.collisionNudge.x));
      this.y = Math.min(this.bounds.maxY, Math.max(this.bounds.minY, this.y + (awayY / length) * this.minDistance * this.collisionNudge.y));
      this.element.style.transition = this.collisionTransition;
      this.element.style.left = `${this.x}%`;
      this.element.style.top = `${this.y}%`;
    }, this.collisionInterval);
  }

  startSleepParticles() {
    if (this.particleTimer) clearInterval(this.particleTimer);
    
    this.particleTimer = setInterval(() => {
      if (this.state !== "sleeping") {
        clearInterval(this.particleTimer);
        return;
      }
      
      const z = document.createElement("span");
      z.className = "zzz";
      z.textContent = "z";
      z.style.left = "65%";
      z.style.top = "-10px";
      this.element.appendChild(z);
      
      setTimeout(() => {
        z.remove();
      }, 3000);
    }, 1500);
  }

  destroy() {
    clearTimeout(this.timer);
    clearInterval(this.collisionTimer);
    if (this.particleTimer) clearInterval(this.particleTimer);
    if (this.container._roamingPets) {
      this.container._roamingPets = this.container._roamingPets.filter(pet => pet !== this);
    }
    this.element.remove();
  }
}

// 3. DOM Controllers
function initZroomWebsite() {
  const companionsGrid = document.getElementById("companionsGrid");
  const searchInput = document.getElementById("searchInput");
  const filterTags = document.querySelectorAll(".filter-tag");
  const legalModal = document.getElementById("legalModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const privacyLinks = document.querySelectorAll(".privacy-trigger");
  const termsLinks = document.querySelectorAll(".terms-trigger");
  const betaLinks = document.querySelectorAll(".beta-trigger");

  // Elevator Panel & Tower Scroll setup
  const towerContainer = document.querySelector(".tower-container");
  const elevatorSidebar = document.getElementById("elevatorSidebar");
  const elevatorBtns = document.querySelectorAll(".elevator-btn");
  const elevatorFloorText = document.getElementById("elevatorFloorText");
  const elevatorArrow = document.getElementById("elevatorArrow");
  const homeLogoBtn = document.getElementById("homeLogoBtn");

  // Interactive Simulator Elements
  const simulatorRoom = document.getElementById("simulatorRoom");
  const simulatorActionBtn = document.getElementById("simulatorActionBtn");
  const simulatorHeaderStatus = document.getElementById("simulatorHeaderStatus");
  const petOverlay = document.getElementById("petOverlay");
  const petNameBadge = document.getElementById("petNameBadge");
  const whitelistDemoPet = document.getElementById("whitelistDemoPet");
  const rewardDemoPet = document.getElementById("rewardDemoPet");
  const demoTriggers = document.querySelectorAll(".demo-trigger");

  let activeFilter = "all";
  let searchQuery = "";
  let lastScrollTop = 0;

  // Lightweight focus-room state. The UI only exposes start/end, while the room
  // still tracks an active session like the app does.
  let focusSessionInterval = null;
  let isFocusing = false;
  let focusElapsedSeconds = 0;
  let demoResetTimer = null;
  let petSummonTimer = null;

  // --- Initialize Roaming Pets ---
  const roamingPetsInstances = [];
  let lobbyCatInstance = null;
  
  function initRoamingPets() {
    // 1F Lobby: Spawn 1 orange tabby cat wandering around
    const lobbyRoom = document.getElementById("lobbyRoom");
    if (lobbyRoom) {
      lobbyCatInstance = new RoamingPet(lobbyRoom, "orange_tabby", "經典橘喵", {
        bounds: { minX: 15, maxX: 85, minY: 68, maxY: 88 },
        moveDurationRange: [8, 12],
        pauseRange: [6500, 11000],
        walkChance: 0.26,
        minDistance: 10
      });
      roamingPetsInstances.push(lobbyCatInstance);
    }
    
    // 3F Companions Room: Spawn every companion on the floor with slow wandering and collision avoidance.
    const companionsRoom = document.getElementById("companionsRoom");
    if (companionsRoom) {
      const companionStartX = [
        [11, 34, 58, 83],
        [20, 44, 68, 90],
        [10, 32, 56, 80],
        [23, 47, 71, 89]
      ];
      const companionStartY = [65, 73, 82, 90];

      companionsData.forEach((pet, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        roamingPetsInstances.push(new RoamingPet(companionsRoom, pet.id, pet.name, {
          bounds: { minX: 9, maxX: 91, minY: 64, maxY: 91 },
          initialPosition: {
            x: companionStartX[row][col],
            y: companionStartY[row]
          },
          moveDurationRange: [46, 68],
          pauseRange: [22000, 36000],
          walkChance: 0.18,
          minDistance: 7.2,
          collisionThreshold: 6.3,
          collisionInterval: 3000,
          collisionCooldown: 5800,
          collisionNudge: { x: 0.08, y: 0.05 },
          collisionTransition: "left 10s ease-out, top 10s ease-out",
          size: 52,
          sleepEnabled: false
        }));
      });
    }
  }

  // --- Elevator Control Functions ---
  function scrollToSection(section, behavior = "smooth") {
    if (!section) return;

    if (window.matchMedia("(max-width: 900px)").matches) {
      const targetTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: targetTop, behavior });
    } else {
      section.scrollIntoView({ behavior });
    }
  }

  window.zroomScrollToFloor = (targetId) => {
    scrollToSection(document.getElementById(targetId), "smooth");
    setTimeout(updateElevatorState, 400);
    setTimeout(updateElevatorState, 900);
  };

  if (homeLogoBtn) {
    homeLogoBtn.addEventListener("click", () => {
      const firstFloor = document.getElementById("floor-1");
      if (firstFloor) {
        scrollToSection(firstFloor, "smooth");
        setTimeout(updateElevatorState, 500);
        setTimeout(updateElevatorState, 1000);
      }
    });
  }

  elevatorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        scrollToSection(targetEl, "smooth");
        setTimeout(updateElevatorState, 500);
        setTimeout(updateElevatorState, 1000);
      }
    });
  });

  function updateElevatorState() {
    // Identify active section by its actual viewport position. This stays
    // accurate for both wheel scrolling and direct hash navigation.
    const floorSections = ["floor-1", "floor-2", "floor-3", "support-center"];
    let activeIndex = 1;
    let closestTop = Infinity;
    floorSections.forEach((sectionId, index) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      const distance = Math.abs(section.getBoundingClientRect().top);
      if (distance < closestTop) {
        closestTop = distance;
        activeIndex = index + 1;
      }
    });
    const activeFloorString = `${activeIndex}F`;
    
    elevatorFloorText.textContent = activeFloorString;
    document.body.classList.toggle("show-floating-download", activeIndex > 1);

    // Determine scroll direction for arrow indicator, adjusting for boundaries
    if (activeIndex >= 4) {
      elevatorArrow.textContent = "▲"; // At bottom (4F), can only scroll up
    } else if (activeIndex === 1) {
      elevatorArrow.textContent = "▼"; // At top (1F), can only scroll down
    } else {
      const scrollTop = towerContainer.scrollTop || window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop > lastScrollTop) {
        elevatorArrow.textContent = "▼"; // scrolling down the page
      } else if (scrollTop < lastScrollTop) {
        elevatorArrow.textContent = "▲"; // scrolling up the page
      }
      lastScrollTop = scrollTop;
    }

    // Update elevator active class
    elevatorBtns.forEach(btn => {
      const targetFloor = btn.getAttribute("data-target");
      const activeTarget = activeIndex === 4 ? "support-center" : `floor-${activeIndex}`;
      if (targetFloor === activeTarget) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Listen scroll event on the Snapping Tower container
  towerContainer.addEventListener("scroll", updateElevatorState);
  window.addEventListener("scroll", updateElevatorState, { passive: true });

  function scrollToHashTarget(behavior = "smooth") {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) scrollToSection(target, behavior);
    }
  }

  window.addEventListener("hashchange", () => {
    scrollToHashTarget("smooth");
    updateElevatorState();
    setTimeout(updateElevatorState, 500);
  });

  window.addEventListener("load", updateElevatorState);

  if (window.location.hash) {
    setTimeout(() => {
      scrollToHashTarget("auto");
      updateElevatorState();
    }, 0);
    setTimeout(updateElevatorState, 700);
  }

  // --- Companions Gallery Setup ---
  function renderCompanions() {
    companionsGrid.innerHTML = "";
    
    const filteredCompanions = companionsData.filter(pet => {
      const matchesFilter = activeFilter === "all" || pet.category.includes(activeFilter);
      const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pet.skill.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filteredCompanions.length === 0) {
      companionsGrid.innerHTML = `
        <div class="no-results">
          <p>找不到符合條件的小夥伴 🐱🐾</p>
        </div>
      `;
      return;
    }

    filteredCompanions.forEach(pet => {
      const card = document.createElement("div");
      card.className = "companion-card";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <div class="avatar-wrapper">
          <img src="assets/avatars/${pet.id}.png" alt="${pet.name}" loading="lazy" />
        </div>
        <div class="companion-name">
          <span>${pet.name}</span>
          <span class="companion-emoji">${pet.emoji}</span>
        </div>
        <div class="companion-cost">
          <span class="coin-icon">🪙</span>
          <span>${pet.cost}</span>
        </div>
        <div class="companion-skill">
          ${pet.skill}
        </div>
      `;
      
      // Update companion overlay inside 2F Focus room when clicked
      card.addEventListener("click", () => {
        petOverlay.src = `assets/avatars/${pet.id}.png`;
        petOverlay.alt = pet.name;
        if (petNameBadge) {
          petNameBadge.textContent = pet.name;
        }
        if (whitelistDemoPet) {
          whitelistDemoPet.src = petOverlay.src;
          whitelistDemoPet.alt = pet.name;
        }
        if (rewardDemoPet) {
          rewardDemoPet.src = petOverlay.src;
          rewardDemoPet.alt = pet.name;
        }
        
        // Scroll to 2F Focus room automatically to preview pet
        const focusFloor = document.getElementById("floor-2");
        if (focusFloor) {
          scrollToSection(focusFloor, "smooth");
        }

        // Play the visible arrival after the room is in view. Keep the room lighting stable.
        clearTimeout(petSummonTimer);
        simulatorRoom.classList.remove("pet-summoning");
        petSummonTimer = setTimeout(() => {
          simulatorRoom.classList.remove("pet-summoning");
          void simulatorRoom.offsetWidth;
          simulatorRoom.classList.add("pet-summoning");
          setTimeout(() => simulatorRoom.classList.remove("pet-summoning"), 1550);
        }, 360);
      });
      
      companionsGrid.appendChild(card);
    });
  }

  // Filters & Search Bindings
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderCompanions();
  });

  filterTags.forEach(tag => {
    tag.addEventListener("click", () => {
      filterTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      activeFilter = tag.getAttribute("data-filter");
      renderCompanions();
    });
  });

  // --- Theme Controller (Forced Light Mode) ---
  document.documentElement.setAttribute("data-theme", "light");

  // --- Focus Room Simulator Logic ---
  function startFocusSession() {
    isFocusing = true;
    focusElapsedSeconds = 0;
    simulatorRoom.classList.remove("resting");
    simulatorRoom.classList.add("focusing");
    
    simulatorHeaderStatus.textContent = "專注進行中";
    simulatorHeaderStatus.classList.add("focusing");
    
    simulatorActionBtn.textContent = "■ 結束專注";
    simulatorActionBtn.className = "simulator-btn btn-stop";

    focusSessionInterval = setInterval(() => {
      focusElapsedSeconds += 1;
    }, 1000);
  }

  function stopFocusSession() {
    isFocusing = false;
    clearInterval(focusSessionInterval);
    focusSessionInterval = null;

    simulatorRoom.classList.remove("focusing");
    simulatorRoom.classList.add("resting");
    
    simulatorHeaderStatus.textContent = "新手教學房";
    simulatorHeaderStatus.classList.remove("focusing");
    
    simulatorActionBtn.textContent = "▶ 開始專注";
    simulatorActionBtn.className = "simulator-btn btn-start";
  }

  function clearFeatureDemo() {
    clearTimeout(demoResetTimer);
    demoResetTimer = null;
    simulatorRoom.classList.remove("demo-mode", "demo-whitelist", "demo-reward");
    demoTriggers.forEach(trigger => trigger.classList.remove("active"));
  }

  function runFeatureDemo(demoName) {
    if (!["mode", "whitelist", "reward"].includes(demoName)) return;

    clearFeatureDemo();

    if ((demoName === "whitelist" || demoName === "reward") && !isFocusing) {
      startFocusSession();
    }

    if (demoName === "whitelist" && whitelistDemoPet) {
      whitelistDemoPet.src = petOverlay.src;
      whitelistDemoPet.alt = petOverlay.alt;
    }

    if (demoName === "reward" && rewardDemoPet) {
      rewardDemoPet.src = petOverlay.src;
      rewardDemoPet.alt = petOverlay.alt;
    }

    const activeTrigger = document.querySelector(`.demo-trigger[data-demo="${demoName}"]`);
    if (activeTrigger) {
      activeTrigger.classList.add("active");
    }

    simulatorRoom.classList.add(`demo-${demoName}`);

    const focusFloor = document.getElementById("floor-2");
    if (focusFloor) {
      scrollToSection(focusFloor, "smooth");
    }

    const demoDuration = demoName === "mode" ? 5400 : demoName === "whitelist" ? 4600 : demoName === "reward" ? 6000 : 2600;

    demoResetTimer = setTimeout(() => {
      simulatorRoom.classList.remove(`demo-${demoName}`);
      if (activeTrigger) {
        activeTrigger.classList.remove("active");
      }
    }, demoDuration);
  }

  simulatorActionBtn.addEventListener("click", () => {
    clearFeatureDemo();
    if (isFocusing) {
      stopFocusSession();
    } else {
      startFocusSession();
    }
  });

  demoTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      runFeatureDemo(trigger.getAttribute("data-demo"));
    });
  });

  // --- Embedded Legal Content (Avoids CORS issues on file:// protocol) ---
  const privacyHtmlContent = `
    <h1>Zroom 隱私權政策</h1>
    <p class="muted">最後更新日期：2026 年 6 月 14 日</p>
    <p>
      本隱私權政策說明 Zroom（以下稱「本 App」）在你使用 macOS 專注、白名單、房間佈置、寵物養成、
      統計紀錄、Apple 帳號同步、iCloud 同步、公共自習室與 App 內購買功能時，如何處理與保護資料。
    </p>
    <h2>1. 我們處理的資料</h2>
    <p>Zroom 目前使用 Sign in with Apple 建立或連接帳號同步。為了提供核心功能，本 App 可能在你的裝置與 Zroom 使用的後端服務中儲存或處理以下資料：</p>
    <ul>
      <li>專注設定，例如白名單 App、專注時間、休息時間、寬限時間、提醒設定與操作偏好。</li>
      <li>專注紀錄，例如開始與結束時間、完成狀態、專注秒數、分心秒數、分心次數、品質分數與心得文字。</li>
      <li>白名單判斷資料，例如專注期間目前前景 App 的名稱，用於判斷是否仍在允許的工作環境。</li>
      <li>遊戲進度，例如金幣、磁鐵、家具、房間佈置、樓層、寵物、心情、技能與解鎖狀態。</li>
      <li>App 內購買狀態，例如 StoreKit 交易權益、非消耗型項目與可恢復購買狀態。</li>
      <li>帳號識別資料，例如 Apple 登入識別碼、Zroom 帳號 ID、Supabase Auth 使用者 ID 與客服識別 ID。</li>
      <li>公共自習室資料，例如所在大樓、樓層、座位、出席狀態與更新時間。</li>
      <li>通知相關設定與本機提醒狀態。</li>
    </ul>
    <h2>2. 我們不收集的資料</h2>
    <p>除非你主動透過電子郵件聯絡我們，Zroom 不會要求或收集你的電話號碼、精確位置、聯絡人、相機、麥克風、照片、聊天內容或社群帳號。</p>
    <p>Zroom 目前沒有第三方廣告 SDK、第三方分析 SDK，也沒有 Google、Facebook、LINE 等第三方登入。</p>
    <h2>3. 資料如何儲存與同步</h2>
    <p>
      Zroom 會將資料保存在你的 Mac 本機，並在你使用 Apple 帳號登入後，將帳號、進度、購買權益、房間、統計、心得與公共自習室所需資料同步到 Zroom 使用的 Supabase 後端服務。
    </p>
    <p>
      若你在設定中啟用 iCloud，部分設定與進度資料也可能會透過 Apple 的
      iCloud Key-Value Storage 在你自己的 Apple ID 裝置間同步。
    </p>
    <p>
      Supabase 用於帳號同步、進度備份、公共自習室座位狀態、交易權益記錄與基本防濫用速率限制。iCloud 同步由 Apple 提供與管理，受 Apple 的隱私權政策與 iCloud 服務條款約束。
    </p>
    <h2>4. 前景 App 名稱與白名單</h2>
    <p>
      為了提供主動專注、白名單與分心提醒，本 App 會在專注期間讀取目前前景 App 的名稱。
      這項資料只用於判斷是否在白名單內、觸發提醒與產生專注統計。若你已登入並啟用帳號同步，專注紀錄中可能包含分心 App 名稱與分心時間摘要，用於在你的帳號中保存統計與心得紀錄。這些資料不會用於廣告追蹤，也不會出售給第三方。
    </p>
    <h2>5. App 內購買與付款</h2>
    <p>
      Zroom 的數位商品與功能解鎖透過 Apple StoreKit / In-App Purchase 處理。付款流程、退款請求、交易紀錄與發票由 Apple 管理。
      Zroom 不會收集或保存你的信用卡號碼、銀行帳戶或其他付款卡資料。
    </p>
    <h2>6. 第三方服務</h2>
    <p>Zroom 目前依賴以下服務提供功能：</p>
    <ul>
      <li>Sign in with Apple：用於帳號登入與身份驗證。</li>
      <li>Supabase：用於帳號進度同步、公共自習室、購買權益記錄與基本防濫用速率限制。</li>
      <li>iCloud Key-Value Storage：用於在同一 Apple ID 的裝置間同步部分 App 進度。</li>
      <li>StoreKit / In-App Purchase：用於處理 App 內購買。</li>
      <li>User Notifications：用於傳送專注提醒與分心提醒。</li>
    </ul>
    <p>
      如果未來加入新的第三方服務或分析工具，本政策會先更新並說明其用途。
    </p>
    <h2>7. 資料分享</h2>
    <p>
      我們不會出售你的個人資料。除提供 App 功能所需的 Apple 系統服務與 Supabase 後端服務外，Zroom 不會主動將你的 App 使用資料分享給第三方。
      若法律要求、主管機關要求或為保護使用者與服務安全所必要，可能依適用法律處理相關資料。
    </p>
    <h2>8. 資料保留、刪除與控制</h2>
    <p>
      本 App 的資料可能保存在你的裝置、你的 iCloud 帳號與 Zroom 使用的後端服務中。你可以透過 App 內設定、登出並重置本機資料、刪除 App、清除 App 資料、
      關閉 iCloud 同步，或在 macOS / iCloud 設定中管理相關資料。
      如果你需要刪除或查詢與 Zroom 帳號同步相關的後端資料，可以透過本政策下方的聯絡方式與我們聯繫，並提供 App 內顯示的客服識別 ID。
    </p>
    <h2>9. 兒童隱私</h2>
    <p>
      Zroom 並非專為兒童設計，也不會刻意向兒童收集個人資料。如果你認為本 App 意外保存了兒童的個人資料，請聯繫我們。
    </p>
    <h2>10. 隱私權政策更新</h2>
    <p>
      我們可能因功能、法律、App Store 要求或服務調整而更新本政策。更新後的版本會在本頁標示新的更新日期。
      重大變更時，我們會以合理方式提醒使用者。
    </p>
    <h2>11. 聯絡方式</h2>
    <p>
      如果你對本隱私權政策或資料處理方式有任何問題，請聯繫：
      <a href="mailto:support@zroomfocus.com">support@zroomfocus.com</a>
    </p>
  `;

  const termsHtmlContent = `
    <h1>Zroom 使用條款</h1>
    <p class="muted">最後更新日期：2026 年 6 月 14 日</p>
    <p>
      歡迎使用 Zroom（以下稱「本 App」）。本使用條款說明你使用本 App 時適用的基本規則。
      使用或下載本 App，即表示你同意本使用條款以及 Apple Media Services Terms and Conditions 中適用於 App Store 的條款。
    </p>
    <h2>1. 接受條款</h2>
    <p>
      如果你不同意本條款，請不要使用本 App。若你代表其他人或組織使用本 App，請確認你有權代表其接受本條款。
    </p>
    <h2>2. App 服務內容</h2>
    <p>
      Zroom 是一款 macOS 專注與養成工具，提供專注計時、白名單判斷、房間佈置、寵物養成、統計紀錄、Apple 帳號同步、iCloud 同步、公共自習室與 App 內購買等功能。
      本 App 主要用途為協助使用者管理專注習慣，不構成醫療、心理、財務、法律或其他專業建議。
    </p>
    <h2>3. 使用授權</h2>
    <p>
      在你遵守本條款的前提下，我們授予你一個有限、非專屬、不可轉讓、可撤回的授權，用於在你擁有或控制的 Apple 裝置上安裝與使用本 App。
      本 App 及其設計、圖像、文字、介面、程式碼與其他內容仍屬開發者或其授權方所有。
    </p>
    <h2>4. 使用者責任</h2>
    <p>你同意不會進行以下行為：</p>
    <ul>
      <li>嘗試破解、反向工程、繞過付費機制或未經授權修改本 App。</li>
      <li>使用本 App 進行違法、侵權、騷擾或破壞他人權益的活動。</li>
      <li>干擾本 App、Apple 服務、StoreKit 或 iCloud 的正常運作。</li>
      <li>以自動化方式濫用本 App 或產生不合理負載。</li>
    </ul>
    <h2>5. 專注、白名單與通知</h2>
    <p>
      Zroom 可協助你在專注期間維持白名單 App 使用狀態，並傳送專注提醒或分心提醒。
      你仍需自行判斷如何安排工作、休息與通知權限；本 App 不保證能防止所有分心或確保特定生產力成果。
    </p>
    <h2>6. App 內購買</h2>
    <p>
      Zroom 可能提供金幣、磁鐵、樓層解鎖、統計功能、心得紀錄或其他數位內容與功能作為 App 內購買。
      所有數位商品與功能解鎖均透過 Apple StoreKit / In-App Purchase 處理。
    </p>
    <ul>
      <li>金幣與磁鐵等消耗型項目只可在本 App 中使用，沒有現金價值，不能兌換現金或轉售。</li>
      <li>樓層、統計功能、心得紀錄與禮包等非消耗型項目會依 Apple StoreKit 權益與交易紀錄恢復。</li>
      <li>付款、取消交易、退款與發票處理由 Apple 管理。退款請求需依 Apple 的 App Store 流程提出。</li>
      <li>若 App Store Connect 顯示的價格與 App 內顯示價格不一致，以 Apple 付款確認畫面顯示的價格為準。</li>
    </ul>
    <h2>7. 帳號同步、iCloud 同步與資料</h2>
    <p>
      Zroom 可使用 Sign in with Apple 與後端服務同步你的進度、購買權益、房間、統計、心得與公共自習室狀態。
      這些同步功能可能受到網路狀態、Apple 登入狀態、後端服務狀態與系統設定影響，我們無法保證同步一定即時或永不中斷。
    </p>
    <p>
      若你啟用 iCloud，本 App 也可能透過 Apple 的 iCloud Key-Value Storage 同步部分進度資料。
      iCloud 同步可能受到網路狀態、Apple ID 狀態、系統設定、iCloud 配額與 Apple 服務可用性影響。
    </p>
    <h2>8. 服務變更與中止</h2>
    <p>
      我們可能隨時修改、暫停或停止本 App 的部分功能，包括商店項目、價格、統計呈現、寵物與房間內容。
      若有重大變更，我們會盡合理努力在 App 更新說明或相關頁面中告知。
    </p>
    <h2>9. 免責聲明</h2>
    <p>
      本 App 依「現狀」提供。我們會盡力維持 App 穩定與資料正確，但不保證本 App 永遠不中斷、無錯誤、完全符合你的需求，或能防止所有資料遺失。
      使用本 App 所產生的專注成果、統計或提醒僅供參考。
    </p>
    <h2>10. 責任限制</h2>
    <p>
      在適用法律允許的最大範圍內，開發者不對因使用或無法使用本 App 所造成的間接、附帶、特殊、懲罰性或衍生性損害負責。
      若法律不允許排除特定責任，本條款不會限制法律不得限制的權利。
    </p>
    <h2>11. 隱私權</h2>
    <p>
      我們如何處理資料請參考
      <a href="#" class="privacy-trigger">Zroom 隱私權政策</a>。
    </p>
    <h2>12. 條款更新</h2>
    <p>
      我們可能因功能、法律或 App Store 要求而更新本條款。更新後的版本會在本頁標示新的更新日期。
      繼續使用本 App 即表示你接受更新後的條款。
    </p>
    <h2>13. 聯絡方式</h2>
    <p>
      如果你對本使用條款有任何問題，請聯繫：
      <a href="mailto:support@zroomfocus.com">support@zroomfocus.com</a>
    </p>
  `;

  // --- Modal Controllers ---
  function openModal(title, htmlContent) {
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    legalModal.classList.add("open");
    document.body.style.overflow = "hidden";

    // Re-bind triggers inside modal (for privacy cross-link in terms of service)
    const innerPrivacyTriggers = modalBody.querySelectorAll(".privacy-trigger");
    innerPrivacyTriggers.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("Zroom 隱私權政策", privacyHtmlContent);
      });
    });
  }

  function closeModal() {
    legalModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  privacyLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("Zroom 隱私權政策", privacyHtmlContent);
    });
  });

  termsLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("Zroom 服務條款", termsHtmlContent);
    });
  });

  betaLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("https://testflight.apple.com/join/RtDKVt9D", "_blank");
    });
  });

  modalClose.addEventListener("click", closeModal);
  legalModal.addEventListener("click", (e) => {
    if (e.target === legalModal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && legalModal.classList.contains("open")) {
      closeModal();
    }
  });

  // --- Custom Cursor & Click Ripples Refinements ---
  const customCursor = document.getElementById("customCursor");
  if (customCursor) {
    // Custom cursor moves with mouse coordinates
    document.addEventListener("mousemove", (e) => {
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
      customCursor.style.opacity = "1";
    });

    // Hide custom cursor if mouse leaves screen bounds
    document.addEventListener("mouseleave", () => {
      customCursor.style.opacity = "0";
    });

    // Mouse click: trigger scale feedback and create a dynamic click ripple
    document.addEventListener("mousedown", (e) => {
      customCursor.classList.add("clicking");
      
      const ripple = document.createElement("div");
      ripple.className = "click-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 400);
    });

    document.addEventListener("mouseup", () => {
      customCursor.classList.remove("clicking");
    });
  }

  // --- 1F Lobby Cat Mouse-Chasing Logic ---
  const floor1 = document.getElementById("floor-1");
  const lobbyRoom = document.getElementById("lobbyRoom");
  if (floor1 && lobbyRoom) {
    let lastLobbyChaseAt = 0;

    floor1.addEventListener("mousemove", (e) => {
      if (!lobbyCatInstance) return;

      const now = Date.now();
      if (now - lastLobbyChaseAt < 240) return;
      lastLobbyChaseAt = now;

      // Apply a deliberately slow, non-elastic chase so the lobby companion drifts instead of snapping.
      if (!lobbyCatInstance.pauseAI) {
        lobbyCatInstance.pauseAI = true;
        lobbyCatInstance.element.style.transition = "left 5.8s cubic-bezier(0.22, 1, 0.36, 1), top 5.8s cubic-bezier(0.22, 1, 0.36, 1)";
        
        // Immediately cancel any active sleep states or zzz particles for Lobby cat when chase begins
        if (lobbyCatInstance.state === "sleeping") {
          lobbyCatInstance.state = "idle";
          lobbyCatInstance.element.className = "roaming-pet idle";
          if (lobbyCatInstance.particleTimer) {
            clearInterval(lobbyCatInstance.particleTimer);
          }
        }
        lobbyCatInstance.element.querySelectorAll(".zzz").forEach(z => z.remove());
      }

      const rect = lobbyRoom.getBoundingClientRect();
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;

      // Keep horizontal position clamped to standard floor walking limits
      const clampedX = Math.max(12, Math.min(88, pctX));
      const targetX = lobbyCatInstance.x + (clampedX - lobbyCatInstance.x) * 0.42;

      // Flip texture based on direction relative to current position
      const catImg = lobbyCatInstance.element.querySelector("img");
      if (pctX < lobbyCatInstance.x) {
        catImg.style.transform = "scaleX(-1)"; // Left
      } else {
        catImg.style.transform = "scaleX(1)"; // Right
      }

      // Check if mouse cursor is on the wall (above Y=66%)
      const isWall = pctY < 66;
      let targetY;

      if (isWall) {
        // Cat jumps along the boundary, cannot move onto the wall
        lobbyCatInstance.element.classList.add("jumping");
        targetY = lobbyCatInstance.y + (68 - lobbyCatInstance.y) * 0.32;
      } else {
        // Cat normal tracking on the floor
        lobbyCatInstance.element.classList.remove("jumping");
        const clampedY = Math.max(68, Math.min(88, pctY));
        targetY = lobbyCatInstance.y + (clampedY - lobbyCatInstance.y) * 0.36;
      }

      // Save coordinate values in class instance for texture flip reference
      lobbyCatInstance.x = targetX;
      lobbyCatInstance.y = targetY;

      // Apply positioning styles
      lobbyCatInstance.element.style.left = `${targetX}%`;
      lobbyCatInstance.element.style.top = `${targetY}%`;
    });

    floor1.addEventListener("mouseleave", () => {
      if (!lobbyCatInstance) return;

      // Resume regular AI walking loop and clear jumping animation
      lobbyCatInstance.pauseAI = false;
      lobbyCatInstance.element.classList.remove("jumping");

      // Restore the slow wandering movement transitions
      lobbyCatInstance.element.style.transition = "left 3.8s linear, top 3.8s linear";
    });
  }

  // Initialize UI, Roaming Pets, and first render
  initRoamingPets();
  renderCompanions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initZroomWebsite, { once: true });
} else {
  initZroomWebsite();
}
