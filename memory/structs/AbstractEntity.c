struct AbstractEntity {
    //** Entity Management Section **//

    // Self Ent Pointer @00
    // - points to itself
    struct AbstractEntity* self; // @00

    // Total Entity Count
    // - Number of all entities (not just in a specific field group)
    int32_t* entity_count; // @04

    // Prev Ent Pointer @08
    // - Points to the prev entity received, or something like that
    struct AbstractEntity* prev_elem; // @08


    // Next Ent Pointer @0C
    // - Points to the next entity received, or something like that
    struct AbstractEntity* next_elem; // @0C

    //** Maybe Empty? Section **//
    // Self Ent Pointer @10
    // - points to this entity
    struct AbstractEntity* self_ptr1; // @10
    char _gap_0[12];

    //** Maybe Empty? Section **//
    // Self Ent Pointer @20
    // - points to this entity
    struct AbstractEntity* self_ptr2; // @20
    char _gap_1[12];



    //** Entity Identification Section **//

    // Self Ent Pointer @30
    // - points to this entity
    struct AbstractEntity* self_ptr3; // @30

    // Unknown value
    uint16_t unknown1; // @34
    // Entity id, part of the <id, hash> representation system
    uint16_t id; // @36
    // Entity hash, part of the <id, hash> representation system
    uint32_t hash; // @38
    char _gap_2[4];



    // Pretty sure this is per client, not server. The emscripten_get_now of when it was created
    double entity_creation_time; // @40

    // 16 Field Groups, all pointing to a FieldGroup struct
    // 0 : RELATIONS
    // 1 : not present
    // 2 : BARREL
    // 3 : PHYSICS
    // 4 : HEALTH
    // 5 : not present
    // 6 : UNUSED
    // 7 : ARENA
    // 8 : NAME
    // 9 : GUI
    // 10: POS
    // 11: STYLE
    // 12: not present
    // 13: SCORE
    // 14: TEAM
    // 15: not present
    struct AbstractFieldGroup* field_groups[16]; // @48
}

sizeof(AbstractEntity) == 136;
