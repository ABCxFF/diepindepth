struct BarrelDefinition
{
  // In radians, direction the barrel is facing
  float angle; // @00
  
  // Delay, delay before the shoot
  // - Half the barrels on the octo have delay .5, for example.
  float delay; // @04
  
  // Size of the barrel (width)
  // - Same as the `size` field sent to the client
  // - Its technically length, when rotated to 0rad, it looks like length
  // - The longer side, not the shorter of a barrel
  float size; // @08
  
  // Offset of the barrel
  // - Displacement off the player's body
  // - Think about twin's barrels, their offsets are NOT 0
  float offset; // @0C
  
  // Whether or not its trapezoidal
  // - Machine gun, stalker
  // - is_trapezoid =& 1 (if there are other flags, idk what they are)
  int32_t is_trapezoid; // @10
  
  // Recoil
  // - Part of the recoil calculations
  float recoil; // @14
  
  // Width
  // - 42 / width to get whats sent to the client at lvl 0
  // - Shorter of the two sides on a barrel
  // - Determines bullet size
  float width; // @18
  
  // Bullet Type
  // - You can think of it lke ['bullet', 'drone', 'trap'][bullet_type i32 thing]
  int32_t bullet.type; // @1C
  
  // Kinda weird
  // - Seems to default to 1
  // - Is low and lower for stronger(?) bullets
  int32_t _unknown0; // @20

  // Bullet Speed
  // - Part of bullet speed formulas
  float bullet.speed; // @24
  
  // Max Drones
  // - Only useful for drone tanks
  // - Max amount of drones you can spawn
  int32_t max_drones; // @28
  
  // Bullet Damage
  // - "I think"
  float bullet.damage; // @2C
  
  // Bullet Base Health
  // - Similar to max health
  // - Max Health for level 0
  float bullet.base_health; // @30
  
  // Unknown, but for every tank this value is 1
  int32_t _unknown1; // @34
  
  // No idea
  int32_t _unknown2; // @38
 
  // Trapezoidal Face Dir
  // - Also known as `shootingAngle`
  // - Direction in radians that a trapezoidal barrel is facing.
  float trapezoidal_dir; // @3C
  
  // Base Reload
  float base_reload; // @40
  
  // Bullet Deacceleration Rate
  // - The higher, the longer the bullet stays at its avg (max I think) speed
  // - Sniper has higher than basic, for example
  float bullet.deaccel_rate; // @44
  
  // Bullet Durability
  // - Relating to the overall life time of a bullet
  // - Example: Higher for trappers than for basic
  float bullet.durability; // @48

  // No idea area
  // 76 - 100
  // - 76 (first) is all ones
  // - 92 (2nd to last) is all 0s
  // - 96 (last) was (idk if it still is) 159 for all trappers
  int32_t _no_ideas[7];
}

sizeof(BarrelDefinition) == 100;
