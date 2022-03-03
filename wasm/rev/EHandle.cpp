#include <cassert>
#include "EHandle.h"

// Constructs an empty EHandle
EHandle::EHandle() {
    simulationId = 0;
    id = 0;
    hash = 0;
}

// Constructs an EHandle out of an entity
EHandle::EHandle(Entity const* entity) {
    if (entity == nullptr) {
        simulationId = 0;
        id = 0;
        hash = 0;
    } else {
        *((long long*) this) = *(long long*) entity->GetHandle();
    }
}
  
// Returns the entity's id
unsigned short EHandle::ID() {
    return id;
}

// Overwrites the entity handle with the encoded EHandle
void EHandle::Decode(Simulation* simulation, BinView& view) {
    simulationId = Simulation->GetID();
    
    hash = view.NextVarUint32();
    // The following assertion is - in the actual source code - being done on line 367 in file `shared/Entity.cpp`
    assert(hash <= 1 << 14);
    if (hash == 0) return;
    id = view.NextVarUint32();
    // The following assertion is - in the actual source code - being done on line 370 in file `shared/Entity.cpp`
    assert(id < 16384);
}

// Encodes the EHandle into its byte format - appending onto a BinData
void EHandle::Encode(BinData &out) const {
    if (hash == 0) {
        out.PushVarUint32(0);
    } else {
        out.PushVarUint32(hash);
        out.PushVarUint32(id);
    }
}

// Gets the entity being referenced by this EHandle
Entity* EHandle::Deref() const {
    if (hash == 0) return nullptr;
 
    Simulation* simulation = Simulation::GetSimulation(simulationId);
    if (simulation == nullptr) return nullptr;
    EntityManager* entities = simulation->Entities();
    // The following assertion is - in the actual source code - being done on line 19 in file `shared/EntityManager.cpp`
    assert(id < 16384);
    
    Entity* entity = entities->GetEntity(id);
    // Following line is a *bit* inaccurate
    if (!entities->existingIds[id] || entity->id != id) return nullptr;
    return entity;
}
