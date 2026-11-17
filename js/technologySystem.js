/// Technology System for Aldora'nın Mirası
/// Manages research, unlocks, and technology tree

/// Technology types with their properties
const TECHNOLOGY_TYPES = {
    farming: {
        name: "Tarım",
        cost: { gold: 50 },
        requirements: { level: 1 },
        unlocks: ["depo", "tava"],
        effects: { food_generation: 5 },
        description: "Yemiş üretimi %10 artar"
    },
    masonry: {
        name: "Mermer İnşaa",
        cost: { wood: 30, gold: 30 },
        requirements: { level: 2, unlockedTechnologies: ["tarim"] },
        unlocks: ["mağara", "işhanesi"],
        effects: { stone_generation: 3 },
        description: "Bina dayanıklılığını %15 artırır"
    }
};
// Researched technologies state
let researchedTechs = [];
// Check if a technology is researched
function isResearched(techKey) {
    return researchedTechs.includes(techKey);
}
// Check technology requirements
function checkTechRequirements(tech) {
    // Check player level
    const playerLevel = S.dyn.ruler ? S.dyn.ruler.level || 1 : 1;
    if (tech.requirements && tech.requirements.level && playerLevel < tech.requirements.level) {
        return false;
    }
    // Check prerequisite technologies
    if (tech.requirements && tech.requirements.unlockedTechnologies) {
        return tech.requirements.unlockedTechnologies.every(req => isResearched(req));
    }
    return true;
}
