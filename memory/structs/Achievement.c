// All I know, size: 168
int something = 54336;
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
  int64_t _unknown_0 = 0; // always 0
  int64_t _unknown_1 = 0; // always 0
  int64_t _unknown_2 = 0; // always 0
  int32_t _unknown_3; // always 1 or pointer
  struct cstr name;
  struct str desc;
}


/*
all definitions
[
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
  },
  {
    "name": "Git gud",
    "desc": "Destroy 10 tanks",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "threshold": 10,
        "tags": {
          "victim.isTank": true
        }
      }
    ]
  },
  {
    "name": "Gitting gud",
    "desc": "Destroy 100 tanks",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "threshold": 100,
        "tags": {
          "victim.isTank": true
        }
      }
    ]
  },
  {
    "name": "Got gud",
    "desc": "Destroy 1000 tanks",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "threshold": 1000,
        "tags": {
          "victim.isTank": true
        }
      }
    ]
  },
  {
    "name": "Starting out",
    "desc": "Destroy something",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "threshold": 1
      }
    ]
  },
  {
    "name": "Getting good",
    "desc": "Destroy 500 things",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "threshold": 500
      }
    ]
  },
  {
    "name": "Destroy EVERYTHING",
    "desc": "Destroy 10000 things",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "threshold": 10000
      }
    ]
  },
  {
    "name": "Gotta start somewhere",
    "desc": "Destroy 10 squares",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "tags": {
          "victim.arenaMobID": "square"
        },
        "threshold": 10
      }
    ]
  },
  {
    "name": "Square hater",
    "desc": "Destroy 500 squares",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "tags": {
          "victim.arenaMobID": "square"
        },
        "threshold": 500
      }
    ]
  },
  {
    "name": "These squares gotta go",
    "desc": "Destroy 10000 squares",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "tags": {
          "victim.arenaMobID": "square"
        },
        "threshold": 10000
      }
    ]
  },
  {
    "name": "It hurts when I do this",
    "desc": "Ram into something",
    "conds": [
      {
        "event": "kill",
        "tags": {
          "weapon.isTank": true
        }
      }
    ]
  },
  {
    "name": "Who needs bullets anyway",
    "desc": "Ram into 100 things",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "tags": {
          "weapon.isTank": true
        },
        "threshold": 100
      }
    ]
  },
  {
    "name": "Look mom, no cannons!",
    "desc": "Ram into 3000 things",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "tags": {
          "weapon.isTank": true
        },
        "threshold": 3000
      }
    ]
  },
  {
    "name": "They ain't a real tank",
    "desc": "Destroy 100 factory drones",
    "conds": [
      {
        "type": "counter",
        "event": "kill",
        "tags": {
          "victim.arenaMobID": "factoryDrone"
        },
        "threshold": 100
      }
    ]
  },
  {
    "name": "2fast4u",
    "desc": "Upgrade Movement Speed to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 0,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "Ratatatatatatatata",
    "desc": "Upgrade Reload to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 1,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "More dangerous than it looks",
    "desc": "Upgrade Bullet Damage to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 2,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "There's no stopping it!",
    "desc": "Upgrade Bullet Penetration to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 3,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "Mach 4",
    "desc": "Upgrade Bullet Speed to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 4,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "Don't touch me",
    "desc": "Upgrade Body Damage to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 5,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "Indestructible",
    "desc": "Upgrade Max Health to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 6,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "Self-repairing",
    "desc": "Upgrade Health Regen to its maximum value",
    "conds": [
      {
        "event": "statUpgraded",
        "tags": {
          "id": 7,
          "isMaxLevel": true
        }
      }
    ]
  },
  {
    "name": "Fire power",
    "desc": "Upgrade to Twin",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 1
        }
      }
    ]
  },
  {
    "name": "Eat those bullets",
    "desc": "Upgrade to Machine Gun",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 7
        }
      }
    ]
  },
  {
    "name": "Snipin'",
    "desc": "Upgrade to Sniper",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 6
        }
      }
    ]
  },
  {
    "name": "Ain't no one sneaking up on ME",
    "desc": "Upgrade to Flank Guard",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 8
        }
      }
    ]
  },
  {
    "name": "Three at the same time",
    "desc": "Upgrade to Triple Shot",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 3
        }
      }
    ]
  },
  {
    "name": "I've got places to be",
    "desc": "Upgrade to Tri-Angle",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 9
        }
      }
    ]
  },
  {
    "name": "BOOM, you're dead",
    "desc": "Upgrade to Destroyer",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 10
        }
      }
    ]
  },
  {
    "name": "Drones are love",
    "desc": "Upgrade to Overseer",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 11
        }
      }
    ]
  },
  {
    "name": "C + E",
    "desc": "Upgrade to Quad Tank",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 4
        }
      }
    ]
  },
  {
    "name": "Now you really ain't sneaking up on me",
    "desc": "Upgrade to Twin Flank",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 13
        }
      }
    ]
  },
  {
    "name": "Insert uncreative achievement name here",
    "desc": "Upgrade to Assassin",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 15
        }
      }
    ]
  },
  {
    "name": "Huntin'",
    "desc": "Upgrade to Hunter",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 19
        }
      }
    ]
  },
  {
    "name": "Eat those pellets!",
    "desc": "Upgrade to Gunner",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 20
        }
      }
    ]
  },
  {
    "name": "BUILD A WALL",
    "desc": "Upgrade to Trapper",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 31
        }
      }
    ]
  },
  {
    "name": "Can't bother using both hands to play?",
    "desc": "Upgrade to Auto 3",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 41
        }
      }
    ]
  },
  {
    "name": "Where did my cannon go?",
    "desc": "Upgrade to Smasher",
    "conds": [
      {
        "event": "classChange",
        "tags": {
          "class": 36
        }
      }
    ]
  },
  {
    "name": "Try some other classes too",
    "desc": "Upgrade to Sniper 100 times",
    "conds": [
      {
        "event": "classChange",
        "type": "counter",
        "threshold": 100,
        "tags": {
          "class": 6
        }
      }
    ]
  },
  {
    "name": "Drones are life",
    "desc": "Upgrade to Overseer 100 times",
    "conds": [
      {
        "event": "classChange",
        "type": "counter",
        "threshold": 100,
        "tags": {
          "class": 11
        }
      }
    ]
  },
  {
    "name": "That was tough",
    "desc": "Kill a boss",
    "conds": [
      {
        "event": "kill",
        "tags": {
          "victim.isBoss": true
        }
      }
    ]
  },
  {
    "name": "Boss Hunter",
    "desc": "Kill 10 bosses",
    "conds": [
      {
        "event": "kill",
        "type": "counter",
        "threshold": 10,
        "tags": {
          "victim.isBoss": true
        }
      }
    ]
  },
  {
    "name": "Eh, you're trying",
    "desc": "Reach 1k points",
    "conds": [
      {
        "event": "score",
        "tags": {
          "total": ">=1000"
        }
      }
    ]
  },
  {
    "name": "Starting to git gud",
    "desc": "Reach 10k points",
    "conds": [
      {
        "event": "score",
        "tags": {
          "total": ">=10000"
        }
      }
    ]
  },
  {
    "name": "You aren't that bad at this",
    "desc": "Reach 100k points",
    "conds": [
      {
        "event": "score",
        "tags": {
          "total": ">=100000"
        }
      }
    ]
  },
  {
    "name": "Okay you're pretty good",
    "desc": "Reach 1m points",
    "conds": [
      {
        "event": "score",
        "tags": {
          "total": ">=1000000"
        }
      }
    ]
  },
  {
    "name": "Jackpot!",
    "desc": "Get 20k points in a single kill",
    "conds": [
      {
        "event": "score",
        "tags": {
          "delta": ">=20000"
        }
      }
    ]
  },
  {
    "name": "LAAAAAAAAAAAAG",
    "desc": "Play with over 1000 ms of latency",
    "conds": [
      {
        "event": "latency",
        "tags": {
          "value": ">=1000"
        }
      }
    ]
  },
  {
    "name": "Shiny!",
    "desc": "???",
    "conds": [
      {
        "event": "kill",
        "tags": {
          "victim.isShiny": true
        }
      }
    ]
  },
  {
    "name": "There are other classes?",
    "desc": "Get to level 45 as a basic tank",
    "conds": [
      {
        "event": "levelUp",
        "tags": {
          "level": 45,
          "class": 0
        }
      }
    ]
  }
]
*/
