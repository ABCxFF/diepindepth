
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
  struct cstr upgrade_msg; // @14
  
  // see vector.c
  // Vector of tank ids
  struct vector[int32_t] upgrades; // ignore the unusual syntax, this isn't made to be C, just to look nice
  
  // Vector of barrel definitions - so, all to eachother (sizeof(BarrelDefinition) == 100)
  struct vector[BarrelDefinition] barrels;
  
  
}
