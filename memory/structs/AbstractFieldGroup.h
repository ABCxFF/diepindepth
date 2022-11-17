/*
    Abstract Field Groupsc contain an entity's
    field group's data. `AbstractFieldGroup`
    size depends on its type

ID : NAME      : SIZE
0 : RELATIONS : 38
2 : BARREL    : 48
3 : PHYSICS   : 108
4 : HEALTH    : 76
6 : UNUSED    :
7 : LOBBY     : ?
8 : ARENA     : 684
9 : NAME      : 28
10: GUI       : 482
11: POS       : 152
12: STYLE     : 112
14: SCORE     : 36
15: TEAM      : 36

    In Emscripten, Pointers are 32 bit.
*/
struct AbstractFieldGroup {
    // Self Ent Pointer @00
    // - points to its owner
    struct AbstractEntity* self;

    // Field State Managers
    // - *n* size list of fields part of the field group
    // - Bytes for the sole purpose of managing a field's state (not really relevant I think on the client)
    uint8_t field_state_managers[n];

    // Field Data
    // - In order of the shuffled fields order
    // - Varying data types and values
    any field_data[n];

    // and some more stuff over yonder 👀
};
