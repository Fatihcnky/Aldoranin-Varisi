/// Combat System for Aldora'nın Mirası
/// Manages battles, enemies, and combat mechanics

/// Enemy types with their properties
const ENEMY_TYPES = {
    raider: {
        name: "Yaycı",
        health: 20,
        attack: 5,
        reward: { wood: 5, gold: 10 },
        xp: 15,
        description: "Köy kaynaklarını toplar, zayıf ama çoğalır"
    },
    warrior_group: {
        name: "Savaş Grubu",
        health: 35,
        attack: 10,
        reward: { iron: 3, gold: 20 },
        xp: 25,
        description: "Dengeli saldırgan, orta seviye tehdit"
    },
    berserker: {
        name: "Berserker",
        health: 50,
        attack: 15,
        reward: { iron: 8, gold: 30 },
        xp: 40,
        description: "Yüksek hasar, düşmana göre hızla ölür"
    }
};

// Village combat state
let villageCombat = {
    isInCombat: false,
    currentEnemy: null,
    enemyWave: 0,
    playersDefeated: 0
};

// Start a random enemy attack
function startRandomAttack() {
    const enemyTypes = Object.keys(ENEMY_TYPES);
    const randomIndex = Math.floor(Math.random() * enemyTypes.length);
    const enemyTypeName = enemyTypes[randomIndex];
    const enemyData = ENEMY_TYPES[enemyTypeName];

    const enemy = {
        type: enemyTypeName,
        name: enemyData.name,
        maxHealth: enemyData.health,
        health: enemyData.health,
        attack: enemyData.attack,
        reward: { ...enemyData.reward },
        xp: enemyData.xp,
        defeated: false
    };

    villageCombat.isInCombat = true;
    villageCombat.currentEnemy = enemy;
    villageCombat.enemyWave++;

    displayMessage(`⚔ ${enemy.name} saldırıya başladı! ${enemy.health} HP`, "error");

    const combatInterval = setInterval(() => {
        if (!villageCombat.isInCombat || enemy.defeated) {
            clearInterval(combatInterval);
            if (enemy.defeated) {
                endCombat(enemy, true);
            } else {
                endCombat(enemy, false);
            }
            return;
        }

        const defenderChance = Math.min(0.3, (S.resources?.warriors || 0) * 0.05);
        const defenseSuccess = Math.random() < defenderChance;

        if (defenseSuccess) {
            displayMessage("✓ Savunma başarılı! Düşman retreated.", "success");
            enemy.health = Math.max(0, enemy.health - 5);
        } else {
            if (S.resources) {
                S.resources.food = (S.resources.food || 30) - 5;
            } else {
                food -= 5;
            }
            displayMessage("✗ Savunma başarısız! 5 food kaybettiniz.", "error");
        }
    }, 3000);

    return enemy;
}
