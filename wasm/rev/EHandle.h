#include "Entity.h"
#include "Simulation.h"
#include "BinView.h"

// EHandle stands for Entity Handle
class EHandle {
private:
    // The id of the simulation the entity is in
    short simulationId;

    // The entity's id/index
    short id;
  
    // The entity's hash
    int hash;

public:
    // Constructs an empty EHandle
    EHandle();
    // Constructs an EHandle out of an entity
    EHandle(Entity const* entity);
  
    // Returns the entity's id
    int ID();
    // Overwrites the EHandle from the encoded byte format
    void Decode(Simulation* simulation, BinView& view);
    // Encodes the EHandle into its byte format - appending onto a BinData
    void Encode(BinData &out) const;
    // Gets the entity being referenced by this EHandle
    Entity* Deref() const;
};
