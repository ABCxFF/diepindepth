
// int something = 115400; // $vector
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
  struct cstr name;
  struct str desc;
  // struct JSON conds[n];
};
