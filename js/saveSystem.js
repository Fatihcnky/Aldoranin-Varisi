/// Save System for Aldora'nın Mirası
/// Stores game state to localStorage and loads it back

// Save game state to localStorage
function saveGame() {
    const saveData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        // Player info
        playerName: playerName || "Yazar",
        playerHouse: playerHouse || "Yenidenbaşlangıç",
        playerLevel: playerLevel || 1,
        playerGold: playerGold || 100,
        // Resources
        wood: wood || 50,
        stone: stone || 20,
        food: food || 30,
        iron: iron || 10,
        // Village
        villagers: villagers || [],
        buildings: buildings || [],
        // Game progress
        day: day || 1,
        season: season || "Yaz",
        year: year || 1,
        // Unlocks
        unlockedBuildings: unlockedBuildings || ["ev", "depo"],
        unlockedTechnologies: unlockedTechnologies || [],
        // Milestones
        milestones: milestones || []
    };
    
    localStorage.setItem("aldora_save", JSON.stringify(saveData));
    displayMessage("Oyun kaydedildi!", "success");
}

// Load game state from localStorage
function loadGame() {
    const saveData = localStorage.getItem("aldora_save");
    
    if (saveData) {
        const data = JSON.parse(saveData);
        
        // Apply saved data (with defaults for missing fields)
        playerName = data.playerName || "Yazar";
        playerHouse = data.playerHouse || "Yenidenbaşlangıç";
        playerLevel = data.playerLevel || 1;
        playerGold = data.playerGold || 100;
        wood = data.wood || 50;
        stone = data.stone || 20;
        food = data.food || 30;
        iron = data.iron || 10;
        villagers = data.villagers || [];
        buildings = data.buildings || [];
        day = data.day || 1;
        season = data.season || "Yaz";
        year = data.year || 1;
        unlockedBuildings = data.unlockedBuildings || ["ev", "depo"];
        unlockedTechnologies = data.unlockedTechnologies || [];
        milestones = data.milestones || [];
        
        displayMessage("Yükleme başarılı! " + (data.playerName || "Yazar") + "'ın köyüne hoş geldiniz.", "success");
        return true;
    } else {
        // No save file - start new game
        startNewGame();
        displayMessage("Yeni oyun başlatıldı! Köyünüzü oluşturun.", "info");
        return false;
    }
}

// Start new game with defaults
function startNewGame() {
    playerName = "";
    playerHouse = "Yenidenbaşlangıç";
    playerLevel = 1;
    playerGold = 100;
    wood = 50;
    stone = 20;
    food = 30;
    iron = 10;
    villagers = [];
    buildings = [];
    day = 1;
    season = "Yaz";
    year = 1;
    unlockedBuildings = ["ev", "depo"];
    unlockedTechnologies = [];
    milestones = [];
    
    // Initialize starting buildings
    addBuilding("ev", 1, 1); // Starting house
    addBuilding("depo", 3, 1); // Starting storage
    
    displayMessage("Yeni oyun başlatıldı! Köyünüzü oluşturun.", "info");
}

// Display message function (placeholder - integrate with existing UI)
function displayMessage(message, type) {
    const logDiv = document.getElementById("log");
    if (logDiv) {
        const msgDiv = document.createElement("div");
        msgDiv.style.cssText = "background:rgba(0,0,0,.65);padding:3px 8px;margin-bottom:3px;border-radius:6px;";
        msgDiv.textContent = message;
        logDiv.appendChild(msgDiv);
        // Keep only last 20 messages
        while (logDiv.children.length > 20) {
            logDiv.removeChild(logDiv.firstChild);
        }
    }
}

// Initialize save system when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Check for existing save on game start
    const hasSave = loadGame();
    
    // Add save/load buttons to UI (will be integrated later)
    if (!document.getElementById("saveBtn")) {
        const saveBtn = document.createElement("button");
        saveBtn.id = "saveBtn";
        saveBtn.className = "button";
        saveBtn.textContent = "Kaydet";
        saveBtn.onclick = saveGame;
        
        const loadBtn = document.createElement("button");
        loadBtn.id = "loadBtn";
        loadBtn.className = "button";
        loadBtn.textContent = "Yükle";
        loadBtn.onclick = loadGame;
        
        const topDiv = document.getElementById("top");
        if (topDiv && !document.getElementById("saveBtn")) {
            topDiv.appendChild(saveBtn);
            topDiv.appendChild(loadBtn);
        }
    }
});