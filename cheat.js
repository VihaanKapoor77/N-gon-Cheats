 { 
        name: "Cheating", 
        description: "Cheating", 
        maxCount: 1, 
        count: 0, 
        frequency: 1, 
        IsJunk: true, 
        isInstant: true, 
        requires: "", 
        killAuraInterval: null, 
        cooldownInterval: null, 
        teleportHandler: null, 
        gTeleportHandler: null, 
        effect() { 
            m.immuneCycle = Infinity; 
            m.coyoteCycles = Infinity; 
            m.damageDone = Infinity; 
            m.maxHealth = Infinity; 
            m.health = Infinity; 
            m.energy = Infinity; 
            m.maxEnergy = Infinity; 
            m.fieldUpgrades[0].ignoreArmor = true; 
            m.fieldUpgrades[1].ignoreArmor = true; 
            m.fieldUpgrades[2].ignoreArmor = true;
            tech.fastTimeFire *= 0.00000001
            tech.fastTime += 0.000001
            tech.fastTimeJump += 0.000001
            m.setMovement();
            b.setFireCD();
            fireRate = Infinity; 
            if (typeof m.displayHealth === 'function') m.displayHealth(); 
            if (typeof b !== 'undefined') { 
                b.giveGuns("missiles"); 
                b.giveGuns("all"); 
                const gunList = ["nail gun", "shotgun", "super balls", "wave", "missiles", "grenades", "spores", "drones", "foam", "harpoon", "mine", "laser"]; 
                gunList.forEach(gun => b.giveGuns(gun)); 
            } 
            if (typeof tech !== 'undefined') { 
                tech.giveTech("cruise missile"); 
                tech.giveTech("active cooling"); 
            } 
            if (typeof m.fieldUpgrades !== 'undefined' && m.fieldUpgrades[m.fieldMode]) { 
                m.fieldUpgrades[m.fieldMode].damage = 100000000000000000000; 
                m.fieldUpgrades[m.fieldMode].ignoreArmor = true; 
            } 
            this.killAuraInterval = setInterval(() => { 
                if (typeof b !== 'undefined' && b.guns) { 
                    if (b.fireCD) b.fireCD = 0; 
                    if (b.fireCycle) b.fireCycle = 0; 
                    b.guns.forEach(gun => { gun.fireDelay = 0; }); 
                    if (b.guns[b.activeGun]) { 
                        b.guns[b.activeGun].ammo = Infinity; 
                        b.guns[b.activeGun].damage = 100000000000; 
                    } 
                } 
                if (typeof mob !== 'undefined' && typeof player !== 'undefined' && player.position) { 
                    const KILL_RADIUS = 5000000; 
                    for (let i = mob.length - 1; i >= 0; i--) { 
                        const target = mob[i]; 
                        if (!target || !target.position) continue; 
                        const dx = target.position.x - player.position.x; 
                        const dy = target.position.y - player.position.y; 
                        const distance = Math.sqrt(dx * dx + dy * dy); 
                        if (distance < KILL_RADIUS) { 
                            m.fieldUpgrades[m.fieldMode].ignoreArmor = true; 
                            target.damage(Infinity); 
                            target.isDead = true; 
                        } 
                    } 
                } 
            }, 10); 
            this.gTeleportHandler = (g) => { 
                if (g.key.toLowerCase() === 'g') { 
                    console.log("It knows_1"); 
                    m.resetHistory(); 
                    Matter.Body.setPosition(player, simulation.mouseInGame); 
                    Matter.Body.setVelocity(player, { x: 0, y: 0 }); 
                    for (let i = 0; i < bullet.length; i++) { 
                        if (bullet[i].botType) { 
                            Matter.Body.setPosition(bullet[i], Vector.add(player.position, { x: 250 * (Math.random() - 0.5), y: 250 * (Math.random() - 0.5) })); 
                            Matter.Body.setVelocity(bullet[i], { x: 0, y: 0 }); 
                        } 
                    }; 
                } 
            }; 
            window.addEventListener('keydown', this.gTeleportHandler); 
            this.cooldownInterval = setInterval(() => { 
                if (typeof b !== 'undefined') { 
                    if (b.fireCD) b.fireCD *= 0.00000001; 
                    if (b.fireCycle) b.fireCycle *= 0.00000001; 
                } 
            }, 1); 
            this.teleportHandler = (z) => { 
                if (z.key.toLowerCase() === 'z') { 
                    if (typeof level !== 'undefined' && level.exit && typeof player !== 'undefined') { 
                        if (typeof Matter !== 'undefined' && Matter.Body) { 
                            Matter.Body.setPosition(player, { x: level.exit.x, y: level.exit.y }); 
                        } 
                        level.nextLevel(); 
                    } 
                } 
            }; 
            window.addEventListener('keydown', this.teleportHandler); 
        }, 
        remove() { 
            if (this.killAuraInterval) clearInterval(this.killAuraInterval); 
            if (this.cooldownInterval) clearInterval(this.cooldownInterval); 
            if (this.teleportHandler) window.removeEventListener('keydown', this.teleportHandler); 
            if (this.gTeleportHandler) window.removeEventListener('keydown', this.gTeleportHandler); 
            m.immuneCycle = 0; 
            m.coyoteCycles = 0; 
            m.damageDone = 1; 
            m.maxHealth = 100; 
            m.health = 100; 
            m.energy = 100; 
            m.maxEnergy = 100; 
            m.fieldUpgrades[0].ignoreArmor = false; 
            m.fieldUpgrades[1].ignoreArmor = false; 
            m.fieldUpgrades[2].ignoreArmor = false; 
            tech.fastTimeFire *= 1
            tech.fastTime += 1
            tech.fastTimeJump += 1
            m.setMovement();
            b.setFireCD();
            fireRate = 1; 
            if (typeof m.displayHealth === 'function') m.displayHealth(); 
            if (typeof tech !== 'undefined' && tech.tech) { 
                const cmIndex = tech.tech.findIndex(e => e.name === "cruise missile"); 
                if (cmIndex !== -1) tech.removeTech(cmIndex); 
                const acIndex = tech.tech.findIndex(e => e.name === "active cooling"); 
                if (acIndex !== -1) tech.removeTech(acIndex); 
            } 
            if (typeof b !== 'undefined' && b.guns) { 
                if (b.guns[b.activeGun]) { 
                    b.guns[b.activeGun].ammo = b.guns[b.activeGun].maxAmmo || 10; 
                    b.guns[b.activeGun].damage = 1; 
                } 
                b.guns.forEach(gun => { gun.fireDelay = gun.defaultFireDelay || 20; }); 
            } 
            if (typeof m.fieldUpgrades !== 'undefined' && m.fieldUpgrades[m.fieldMode]) { 
                m.fieldUpgrades[m.fieldMode].damage = 1; 
                m.fieldUpgrades[m.fieldMode].ignoreArmor = false; 
            }
        }
    },
