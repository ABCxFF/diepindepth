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
    if (entity == NULL) {
        simulationId = 0;
        id = 0;
        hash = 0;
    } else {
        *((long long*) this) = *(long long*) entity->GetHandle();
    }
}
  
// Returns the entity's id
int EHandle::ID() {
    return id;
}

// Overwrites the entity handle with the encoded EHandle
void EHandle::Decode(Simulation* simulation, BinView& view) {
    simulationId = Simulation->GetID();
    
    hash = view.NextVarUint32();
    // The following assertion is - in the actual source code - being done on line 367 in file `shared/Entity.cpp`
    assert(hash <= 1 << 14);
    if (hash == 0) return;
    id = NextVarUint32();
    // The following assertion is - in the actual source code - being done on line 370 in file `shared/Entity.cpp`
    assert(id < 16384);
}

// Gets the entity being referenced by this EHandle
Entity* EHandle::Deref() const {
    if (hash == 0) return NULL;
 
    Simulation* simulation = Simulation::GetSimulation(simulationId);
    if (simulation == NULL) return NULL;
    EntityManager* entities = simulation->Entities();
    // The following assertion is - in the actual source code - being done on line 19 in file `shared/EntityManager.cpp`
    assert(id < 16384);
    
    Entity* entity = entities->GetEntity(id);
    if (simulation->IDManager->ids[id] + entity->id == 0 || entity->id != id) return NULL;
    return entity;
}
