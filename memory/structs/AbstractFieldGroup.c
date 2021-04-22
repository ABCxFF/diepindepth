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
    int32_t field_data[n]

    // and some more stuff over yonder 👀
}
