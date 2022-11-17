/*
    Abstract Entity manages all data relating to an entity
   `AbstractEntity` structs are 136 bytes of size

    In Emscripten, Pointers are 32 bit.
*/

struct AbstractEntity {
    //** Entity Node Metadata **//

    // Self Ent Pointer @00
    // - points to itself
    struct AbstractEntity* self; // @00

    // Linked List
    // - Pointers to the double linked list which contains all entities.
    struct DoubleLinkedList<struct AbstractEntity>* entity_list; // @04

    // Prev Ent Pointer @08
    // - Points to the previous entity in the double linked list.
    struct AbstractEntity* prev_elem; // @08


    // Next Ent Pointer @0C
    // - Points to the next entity in the double linked list.
    struct AbstractEntity* next_elem; // @0C

    //** Empty Node Metadata 1 **//
    // Self Ent Pointer @10
    // - points to this entity
    struct AbstractEntity* self_ptr1; // @10
    uint8_t _gap_0[12];

    //** Empty Node Metadata 1 **//
    // Self Ent Pointer @20
    // - points to this entity
    struct AbstractEntity* self_ptr2; // @20
    uint8_t _gap_1[12];



    //** Entity Identification Section `EHandle` **//

    // Simulation Pointer @30
    // - points to the entity's simulation
    struct Simulation* simulation; // @30

    // Simulation ID
    uint16_t simulation_id; // @34
    // Entity id, part of the <id, hash> representation system
    uint16_t id; // @36
    // Entity hash, part of the <id, hash> representation system
    uint32_t hash; // @38

    //** Other Properties **//
    
    uint8_t _gap_2[4];

    // The emscripten_get_now (performance.now()) of when the entity was received
    double entity_creation_time; // @40

    // 16 Field Groups, all pointing to a FieldGroup struct
    // 0 : RELATIONS
    // 1 : not present
    // 2 : BARREL
    // 3 : PHYSICS
    // 4 : HEALTH
    // 5 : not present
    // 6 : EXAMPLE
    // 7 : LOBBY
    // 8 : ARENA
    // 9 : NAME
    // 10: GUI
    // 11: POS
    // 12: STYLE
    // 13: not present
    // 14: SCORE
    // 15: TEAM
    struct AbstractFieldGroup* field_groups[16]; // @48
};
