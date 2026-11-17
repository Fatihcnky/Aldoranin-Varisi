/// Building System for Aldora'nın Mirası
/// Manages village buildings, upgrades, and properties

/// Available building types with their properties
const BUILDING_TYPES = {
    ev: {
        name: "Ev",
        cost: { wood: 20, stone: 10 },
        requirements: { level: 1 },
        maxLevel: 5,
        capacity: 5,
        generation: { wood: 2, stone: 1 },
        description: "Köylüleri konut sağlar ve hapşır rütbünü artırır"
    },
    depo: {
        name: "Depo",
        cost: { wood: 30, stone: 20 },
        requirements: { level: 1 },
        maxLevel: 5,
        capacity: 100,
        generation: null,
        description: "Kaynakları (demir, maden, barbunya) depolar"
    }
};
