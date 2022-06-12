# Stats

In this document, the affects of skills/stats will be described. Each stat is listed in the table contents, along with what it affects and by how much.

### Table of Contents
- [Table of Contents](#table-of-contents)
- [Stats Breakdown](#stats-breakdown)
  - [Health Regen](#health-regen)
  - [Max Health](#max-health)
  - [Body Damage](#body-damage)
  - [Bullet Speed](#bullet-speed)
  - [Bullet Penetration](#bullet-penetration)
  - [Bullet Damage](#bullet-damage)
  - [Reload](#reload)
  - [Movement Speed](#movement-speed)
<!--
- [Example](#example)
  - [Calculating Bullets vs Bullets](#calculating-bullets-vs-bullets)
  - [Calculating Tank HP vs Bullets](#calculating-tank-hp-vs-bullets)
  - [Calculating Tank HP vs Tank HP](#calculating-tank-hp-vs-tank-hp)
-->

## Stats Breakdown
A summary of the effects of each stat on the tank.
- The variable `P` is the number of points invested in that stat.
- The variable `L` is the current level of the tank.
- The variable `M` is any additional tank multipliers, found in [tankdefs.json](/extras/tankdefs.json).

---

### Health Regen
Regenerates more percentage of the tank's health per second: `0.1 + (0.4 * P)`
- Each skill point increases the percentage by 0.4%
- Base regeneration speed is 0.1% of health/sec.
- "Hyper" regen takes priority after 30 seconds of not being hit, regenerating at 10% of health/sec (stacks with base)
- Regeneration accelerates with time.

### Max Health
Increases the tank's maximum health points: `50 + (2 * (L - 1)) + (20 * P)`
- Each skill point increases the max HP by 20.
- Base max HP, or the HP of a level 1 tank, is 50.
- Every level up adds 2 to the max HP, so at level 45, max HP is already 138 HP.

### Body Damage
Increases collision damage of tank to shape: `20 + (4 * P)` and tank to tank: `30 + (6 * P)`
- Each skill point increases the damage of collisions; tank-shape by 4 points; tank-tank by 6 points.
- The base damage for collsions; tank-shape is 20; tank-tank is 30.
- Body damage deals 50% more damage for tank-tank than tank-shape collisions.

## Bullet Speed
Increases the bullet's speed in background squares per second: `(5 + (4 * P)) * M`
- Each skill point increases speed of the bullet by 4 squares/sec.
- Base bullet speed is 5 squares/sec.
- M is the overall multiplier for the bullet's barrel, usually 1, Destroyer is 0.699, Sniper is 1.5, etc.

### Bullet Penetration
Increases the bullet's maximum health points: `(8 + (6 * P)) * M`
- Each skill point increases the bullet's max HP by 6.
- Base bullet's max HP is 8.
- M is the overall multiplier for the bullet's barrel, usually 1, Destroyer is 2, Overlord's drones is 2, etc.

### Bullet Damage
Increases the bullet's damage dealt: `(7 + (3 * P)) * M`
- Each skill point increases the bullet's damage dealt by 3.
- Base bullet's damage dealt is 7.
- M is the overall multiplier for the bullet's barrel, usually 1, Destroyer is 3, Overlord's drones is 0.699, etc.

### Reload
Will be posted a later date

### Movement Speed
See <https://github.com/ABCxFF/diepindepth/blob/main/physics/README.txt> for more information on movement, and the movement speed stat's effect on movement.

---
<!--
## Example
With the knowledge about stats from above, this is how to calculate what happens when a tank or a shape collides. 

The following cases assume a direct hit is taken, as opposed to skimming, otherwise there will be more leftovers than usual.

## Calculating Bullets vs Bullets
How many Overlord drones does it take to stop a Destroyer's bullet?
- 1 Overlord drone = 2 pen * 0.699 dmg = 1.398 pts
- 1 Destroyer bullet = 2 pen * 3 dmg = 6 pts
- Drones required = 6/1.398 = 4.291 or 4 drones dead + 1 drone weakened by 29%

## Calculating Tank HP vs Bullets
How much HP left after taking a hit from a max upgraded Destroyer's bullet?
- Destroyer's bullet penetration = (8 + (6 * 7)) * 2 = 100 pen
- Destroyer's bullet damage = (7 + (3 * 7)) * 3 = 84 dmg
- Destroyer's bullet value overall = 100 * 84 = 8400 pts
- Max health points = 50 + (2 * 44) + (20 * 7) = 278 hp
- Max body damage = 20 + (4 * 7) = 48 bd
- Damage to be dealt = 8400 / 48 = 175 dmg
- HP leftover = 278 - 175 = 103 HP or 37%

## Calculate Tank HP vs Tank HP
How much HP left after a max smasher hits a max rammer Destroyer?
- Smasher HP = 50 + (2 * 44) + (20 * 10) = 338 hp
- Smasher BD = 30 + (6 * 10) = 90 bd
- Destroyer HP = 50 + (2 * 44) + (20 * 7) = 278 hp
- Destroyer BD = 30 + (6 * 7) = 72 bd
- Smasher hits until death = 338 / 72 = 4.694444
- Destroyer hits until death = 278 / 90 = 3.08888
- Ratio of health lost = (3.08888 / 4.694444) = 0.6579
- Leftover HP = 338 * (1 - 0.6579) = 115.62 or around 34%
-->
