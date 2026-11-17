/// NPC System for Aldora'nın Mirası
/// Manages villagers, AI, and missions

/// Villager role types
const VILLAGER_ROLES = {
    farmer: { name: "Ağrar", skills: ["toplum"], productivity: 1.0, needs: ["food", "sleep"] },
    woodcutter: { name: "Ağaççı", skills: ["orman"], productivity: 1.2, needs: ["food", "sleep"] },
    miner: { name: "Madenci", skills: ["maden"], productivity: 1.5, needs: ["food", "sleep"] },
    warrior: { name: "Silahlı", skills: ["savaş"], productivity: 0.8, needs: ["food", "sleep"], combat: true },
    builder: { name: "Mimar", skills: ["bina"], productivity: 1.3, needs: ["food", "sleep"] },
    trader: { name: "Ticaretçi", skills: ["ticaret"], productivity: 1.1, needs: ["food", "sleep"] }
};