#include "EntityManager.h"
#include "EventManager.h"
#include "SystemManager.h"

class Simulation {
private:
    // The current tick
    unsigned int tick;

    // The simulation id
    unsigned short id;

    // The game of the simulation
    Game* game;
    
    // The entity manager of the simulation
    EntityManager entities;
    
    // The event manager of the simulation
    EventManager events;
    
    // The system manager of the simulation
    SystemManager systems;
    
public:
    // Constructs a simulation out of the game
    Simulation(Game* game);
    
    // Getter for the simulation's `id`
    unsigned short GetID();
    // Getter for the simulation's `tick`
    unsigned int Tick();
    // Setter for the simulation's `tick`
    void Tick(unsigned int tick);
    // Getter for the simulation's `game`
    Game* Game();
    
    // Getter for the simulation's `entities`
    EntityManager* Entities();
    // Getter for the simulation's `events`
    EventManager* Event();
    // Getter for the simulation's `systems`
    SystemManager* System();
    
    // Returns the simulation with the given id
    static Simulation* GetSimulation(unsigned short id);
    
    // Deconstructs the simulation - for deconstruction of the managers
    Simulation::~Simulation();
};
