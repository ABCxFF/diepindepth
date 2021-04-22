
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
  
  // Vector of barrel definitions - so, all to eachother (sizeof(BarrelDefinition) == 100)
  struct vector[BarrelDefinition] barrels; // @34 - @3C
  
  // The level you need to be at to upgrade to this tank
  int32_t level_requirement; // @40
  
  // Field factor helps determine the fov, see extras/algo.md#fov
  float field_factor; // @44
  
  int32_t _unknown0; // @48 - not in my notes
  
  // When this value is set (not 0), it means the tank is square shapes
  int32_t is_square; // @4C
  
  int32_t _unknown1; // @50 - not in my notes
  int32_t _unknown2; // @54 - not in my notes
  int32_t _unknown3; // @58 - not in my notes
  int32_t _unknown4; // @60 - not in my notes
  
  // Determines stuff like auto turret, spike / smasher, and other weird stuff like if its an auto three
  // - Flags here change every update
  // - Found a value for this once that made the entire gui grayscale
  int32_t addons; // @64
  
  // Yeah, this is weird
  // To get the border width present in the packets (7.5), you apply 112.5 / load_i32(barrelDefPtr + 0x68)
  // - Someone should find out if this correlates with canvas or protocol, or both
  int32_t border_width; // @68
  
  int32_t _unknown5; // @6C - not in my notes
  int32_t _unknown6; // @70 - not in my notes
  
  struct cstr stat_names[8]; // @74 - @D4 
  struct int32_t stat_maxes[8]; // @D4 - @F4
  
  // Nothing in my notes whether this is the end or not. Ill update later
}

sizeof(TankDefinition) == 244? - not sure
