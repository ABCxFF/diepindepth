
/*
    Tank Definitions have all data relating to
    tanks. `TankDefinition` structs are (probably)
    244 bytes of size.
    
    In Emscripten, Pointers are 32 bit.
*/

// Tank Definitions are stored in a linked list, meaning each element
// points to the next, they aren't all next to eachother in memory.
//
// The tank definitions are surprisingly not in order of id, but they 
// are in the same order every update - not fully sure what the order
// they are in means yet.

struct TankDefinition
{
  // Points to the next tank definition, or its value is 0
  struct TankDefinition* next_tank; // @00

  // Tank ID (see extras/tanks.js) - all of these ints have the same value
  int32_t entity_id; // @04
  int32_t _entity_id2; // @08
  int32_t _entity_id3; // @0C
  
  // see cstr.js
  struct cstr name; // @10
  struct cstr upgrade_msg; // @1C
  
  // see vector.c
  // Vector of tank ids
  struct vector[int32_t] upgrades; // @28 - @30
  
  // Vector of barrel definitions - so, all to eachother (sizeof BarrelDefinition's == 100)
  struct vector[Barrel] barrels; // @34 - @3C
  
  // The level you need to be at to upgrade to this tank
  int32_t level_requirement; // @40
  
  // Field factor helps determine the fov, see extras/algo.md#fov
  float field_factor; // @44

  // For all tanks it is set to one, except for mothership which is 0.01
  float movement_speed; // @48
  
  // When this value is set (not 0), it means the tank is square shape
  bool is_square; // @4C

  float _unknown0; // @50 - Always set to 0.23, with exception to landmine and manager, which is set to 0
  float _unknown1; // @54 - Always 0.8, except for landmine which is 1.6
  float _unknown2; // @58 - Always 0.03, (landmine is interestingly expressed differently in float form though)

  // The following booleans are one byte in size
  // Unused boolean, always set to true
  bool _unknown3; // @5C
  // The following is only set for mothership, the assumption is that it has a team/arrow field group.
  bool has_arrow; // @5D
  // The following is only set for predator, the assumption is that it allows for fov extending
  bool has_fov_ability; // @5E
  // The following is set for tanks that can no longer be selected in sandbox. They are considered dev mode tanks
  bool requires_devmode; // @5F

  // Determines stuff like auto turret, spike / smasher, and other weird stuff like if its an auto three
  // - Values here change every update - not fully understood yet
  // - Found a value for this once that made the entire gui grayscale
  // - Auto 5 + Auto 3 is possible and beautiful (:
  int32_t addons[2]; // @60 - @64
  
  // Yeah, this is weird
  // To get the border width present in the packets (7.5), you apply 112.5 / load_i32(barrelDefPtr + 0x68)
  // - Someone should find out if this correlates with canvas or protocol, or both
  int32_t border_width; // @68
  
  // Defaults to 50, with dominator tanks it is 6000
  int32_t max_health; // @6C

  int32_t _unknown4; // @70 - not in my notes
  
  struct cstr stat_names[8]; // @74 - @D4 
  int32_t stat_maxes[8]; // @D4 - @F4
  
  // Nothing in my notes whether this is the end or not. Ill update later
};
