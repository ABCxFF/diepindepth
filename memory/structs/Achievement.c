// All I know, size: 168

/* Example Achievement Definition
{
  "name": "A moment to cherish forever",
  "desc": "Destroy your first tank",
  "conds": [
    {
      "event": "kill",
      "tags": {
        "victim.isTank": true
      }
    }
  ]
}
*/

struct Achievement
{
  int32_t pointer; // idk where or why it points, but it does
  
  struct cstr name;
  struct cstr desc;
}
