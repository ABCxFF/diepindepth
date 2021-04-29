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
7 : ARENA     : 684
8 : NAME      : 28
9 : GUI       : 482
10: POS       : 152
11: STYLE     : 112
13: SCORE     : 36
14: TEAM      : 36
(credits to Peruna)

    In Emscripten, Pointers are 32 bit.
*/
struct AbstractFieldGroup
{
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
    int32_t field_data[n];

    // and some more stuff over yonder 👀
};
