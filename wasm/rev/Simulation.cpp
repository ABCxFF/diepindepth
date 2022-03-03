#include "Simulation.h"

// Constructs a simulation out of the game
Simulation::Simulation(Game* game) {
    this->tick = 0;
    // #########################
    // After this code is an indirect call - not fully analyze
    // #########################
    unknownCall(this->id);
    this->game = game;
}

// Getter for the simulation's `id`
unsigned short Simulation::GetID() {
    return id;
}

// Getter for the simulation's `tick`
unsigned int Simulation::Tick() {
    return tick;
}

// Setter for the simulation's `tick`
void Simulation::Tick(unsigned int tick) {
    this->tick = tick;
}
// Getter for the simulation's `game`
Game* Simulation::Game() {
    return game;
}

// Getter for the simulation's `entities`
EntityManager* Simulation::Entities() {
    return &entities;
}

// Getter for the simulation's `events`
EventManager* Simulation::Event() {
    return &events;
}

// Getter for the simulation's `systems`
SystemManager* Simulation::System() {
    return &systems;
}

// Returns the simulation with the given id
static Simulation* Simulation::GetSimulation(unsigned short id) {
    /*
        There is a lack of analysis on global variables and structures
        within this section the repo which makes the following code not
        100% accurate - and harder to explain with just code. Inside of
        global .bss memory there is an array of size `65536`, full of
        pointers to pointers to "Simulation" classes (although most of
        these pointers are NULL most of the time). This method simply
        fetches the `id`th pointer and returns it.

        // Somewhere in a global scope
        // Simulation* SIMULATION_LIST[65536];
    */
    
    return *SIMULATION_LIST[id];
}

// Deconstructs the simulation - for deconstruction of the managers
Simulation::~Simulation() {
    // #########################
    // After this code is an indirect call - not fully analyze
    // #########################
    unknownCall(id);
    
//  Part of base deconstructor
//     delete systems;
//     delete entities;
}
