/// Game System for Aldora'nın Mirası
/// Manages game loop, days, seasons, and overall state

/// Game state configuration
const GAME_STATE = {
    currentDay: 1,
    currentSeason: "Yaz",
    currentYear: 1,
    gameSpeed: 1,
    ticksPerDay: 60,
    tickCount: 0
};

// Season definitions
const SEASONS = {
    Yaz: { name: "Yaz", foodBonus: 1.0 },
    Sonbahar: { name: "Sonbahar", foodBonus: 0.9 },
    Kış: { name: "Kış", foodBonus: 0.7 },
    Bahar: { name: "Bahar", foodBonus: 1.1 }
};

// Village game state
let villageGameState = {
    isPaused: false,
    totalDaysSurvived: 0,
    totalSeasonsChanged: 0
};

// Advance game time by one tick
function advanceTick() {
    if (villageGameState.isPaused) return;
    GAME_STATE.tickCount++;

    if (GAME_STATE.tickCount >= GAME_STATE.ticksPerDay) {
        GAME_STATE.tickCount = 0;
        GAME_STATE.currentDay++;

        if (GAME_STATE.currentDay % 4 === 1) {
            changeSeason();
        }

        displayMessage(`Gün ${GAME_STATE.currentDay} - ${SEASONS[GAME_STATE.currentSeason].name}`, "info");
    }
}

// Change season function
function changeSeason() {
    const seasons = Object.keys(SEASONS);
    const currentIndex = SEASONS[GAME_STATE.currentSeason].name === "Yaz" ? 0 :
                        SEASONS[GAME_STATE.currentSeason].name === "Sonbahar" ? 1 :
                        SEASONS[GAME_STATE.currentSeason].name === "Kış" ? 2 : 3;
    const nextIndex = (currentIndex + 1) % 4;
    const nextSeasonKey = Object.keys(SEASONS)[nextIndex];

    GAME_STATE.currentSeason = nextSeasonKey;
    villageGameState.totalSeasonsChanged++;

    displayMessage(`Yeni Sezon: ${SEASONS[nextSeasonKey].name}!`, "info");

    // Apply season effects
    if (S.resources) {
        S.resources.food = (S.resources.food || 30) * SEASONS[nextSeasonKey].foodBonus;
    } else {
        food = Math.max(1, food * SEASONS[nextSeasonKey].foodBonus);
    }
}

// End current day
function endDay() {
    GAME_STATE.currentDay++;
    GAME_STATE.totalDaysSurvived++;

    if (GAME_STATE.currentDay % 4 === 1) {
        changeSeason();
    }

    displayMessage(`Gün ${GAME_STATE.currentDay} bitti. Kalan gıda: ${food || 30}`, "success");
    saveGame();
}

// Initialize game system on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    const savedState = localStorage.getItem("aldora_gameState");
    if (savedState) {
        villageGameState = JSON.parse(savedState);
        GAME_STATE.currentDay = savedState.currentDay || 1;
        GAME_STATE.currentSeason = savedState.currentSeason || "Yaz";
        GAME_STATE.ticksPerDay = 60;
    }

    // Add game speed controls
    if (!document.getElementById("speed-control")) {
        const speedContainer = document.createElement("div");
        speedContainer.id = "speed-control";
        speedContainer.innerHTML = '<span>Hız: <button class="mb2" data-a="set-speed" data-v="0">⏸</button> <button class="mb2" data-a="set-speed" data-v="1">1x</button> <button class="mb2" data-a="set-speed" data-v="2">2x</button></span>';
        const topDiv = document.getElementById("top");
        if (topDiv) topDiv.appendChild(speedContainer);
    }
});