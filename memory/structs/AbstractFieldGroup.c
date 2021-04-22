struct AbstractFieldGroup
{
    // Self Ent Pointer @00
    // - points to its entity
    int32_t self;

    // Field Ids
    // - *n* size list of fields part of the field group
    // - Unknown purpose of this list, but it is trivial in the unshuffling of fields
    uint8_t fields[n];

    // Field Data
    // - In order of the shuffled fields order
    // - Varying data types and values
    int32_t data[n]

    // and some more stuff over yonder 👀
}
