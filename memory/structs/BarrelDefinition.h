/*
    Barrel Definitions have all data relating to
    barrels (and their bullets) `Barrel Definitions`
    structs are 100 bytes of size
    
    In Emscripten, Pointers are 32 bit.
*/

struct BarrelDefinition {
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
  // - is_trapezoid =& 1 (there are other (weird) flags, idk what they are)
  int32_t is_trapezoid; // @10
  
  // Recoil
  // - Part of the recoil calculations
  float recoil; // @14
  
  // Width
  // - 42 * width to get whats sent to the client at lvl 0
  // - Shorter of the two sides on a barrel
  // - Determines bullet size
  float width; // @18
  
  // Bullet Type
  // - You can think of it lke ['bullet', 'drone', 'trap'][bullet_type i32 thing]
  int32_t bullet_type; // @1C
  
  // Knockback Factor
  // - Name pending
  // - Used to determine knockback applied to the bullet after collision
  float knockback_factor; // @20

  // Bullet Speed
  // - Part of bullet speed formulas
  float bullet_speed; // @24
  
  // Max Drones
  // - Only useful for drone tanks
  // - Max amount of drones you can spawn
  int32_t max_drones; // @28
  
  // Bullet Damage (?)
  // - "I think"
  float bullet_damage; // @2C
  
  // Bullet Base Health
  // - Similar to max health
  // - Max Health for level 0
  float bullet_base_health; // @30
  
  // Unknown, but for every barrel this value is 1
  int32_t _unknown1; // @34
  
  // Size (in relation to the barrel) of the bullet (or other) shot out.
  // Smaller for predator for example
  float bullet_size_ratio; // @38
 
  // Trapezoidal Face Dir
  // - Also known as `shootingAngle`
  // - Direction in radians that a trapezoidal barrel is facing.
  float trapezoidal_dir; // @3C
  
  // Base Reload
  // - The amount of ticks per each shot can be calculated by ceil((15 - reload stat points) * base reload);
  // - Defaults to 1
  float base_reload; // @40
  
  // Spread Multiplier
  // - The finding of this field was automatically generated, so we haven't looked into this much
  float spread_multiplier; // @44
  
  // Bullet Durability (Life Length)
  // - Relating to the overall life time of a bullet
  // - Example: Higher for trappers than for basic
  float bullet_durability; // @48

  // Unknown
  // 76 - 88 (excluding 88) are all ones. set by the CannonClass constructor
  int32_t _no_ideas[3];

  // Force Fire
  // - The finding of this field was automatically generated, so we haven't looked into this much
  bool force_fire; // @58

  // Bullet Addon - executed on to a bullet when it is fired.
  int32_t bullet_addon;
  
  // Addon, determines addons to the barrel after render - for example: Traps (the only example)
  // - Values here change every update - they are indexes in the Function Table, for addon generation
  int32_t addon; // @60
};
