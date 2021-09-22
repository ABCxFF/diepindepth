# Addon Information

Raw values and other information about addons in tank definitions.

> Random Notes:
> - a square shaped tank's base size (half width) is `32.5√2`  
> - a hexadecagon shaped tank's base size (half width) is `25√2`  

--- 

## Addons

- [Addon Information](#addon-information)
  - [Addons](#addons)
  - [Dominator Base Addon](#dominator-base-addon)
  - [Smasher Addon](#smasher-addon)
  - [Landmine Addon](#landmine-addon)
  - [Spike Addon](#spike-addon)
  - [Auto Smasher Addon](#auto-smasher-addon)
  - [Auto Turret Addon](#auto-turret-addon)
  - [Auto 5 Addon](#auto-5-addon)
  - [Auto 3 Addon](#auto-3-addon)
  - [Pronounced Addon](#pronounced-addon)
  - [Destroyer Dominator Pronounced Addon](#destroyer-dominator-pronounced-addon)
  - [Gunner Dominator Pronounced Addon](#gunner-dominator-pronounced-addon)
  - [Launcher Addon](#launcher-addon)

## Dominator Base Addon

What I like to call a Guard Addon, the Dominator Base Addon has one object attached to the player, that rotates separately from it - which is decided by the `absoluteRotation` flag in the `motion` field.

| Key              | Value  | Desc                                                                          |
| ---------------- | ------ | ----------------------------------------------------------------------------- |
| Sides            | `6`    | The shape of a dombase addon is a hexagon                                     |
| Size Ratio       | `1.24` | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.0`  | The hexagon's rotation per tick, in radians. Aka doesn't spin                 |

## Smasher Addon

Another Guard Addon. The Smasher Addon has one object attached to the player, that rotates separately from it.

| Key              | Value  | Desc                                                                          |
| ---------------- | ------ | ----------------------------------------------------------------------------- |
| Sides            | `6`    | The shape of a smasher addon is a hexagon                                     |
| Size Ratio       | `1.15` | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.1`  | The hexagon's rotation per tick, in radians                                   |

## Landmine Addon

Another Guard Addon. The Landmine Addon has two objects attached to the player, that rotate separately from it.

**Object 1:**
| Key              | Value  | Desc                                                                          |
| ---------------- | ------ | ----------------------------------------------------------------------------- |
| Sides            | `6`    | The first shape of a landmine addon is a hexagon                              |
| Size Ratio       | `1.15` | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.1`  | The hexagon's rotation per tick, in radians                                   |

**Object 2:**
| Key              | Value  | Desc                                                                          |
| ---------------- | ------ | ----------------------------------------------------------------------------- |
| Sides            | `6`    | The second shape of a landmine addon is also a hexagon                        |
| Size Ratio       | `1.15` | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.05` | The hexagon's rotation per tick, in radians                                   |

## Spike Addon

Another Guard Addon. The Spike Addon has four objects attached to the player, that all rotate separately from it.

**Object 1:**
| Key              | Value  | Desc                                                                           |
| ---------------- | ------ | ------------------------------------------------------------------------------ |
| Sides            | `3`    | The first shape of a spike addon is a triangle                                 |
| Size Ratio       | `1.3`  | The triangle's size in game is the ratio multiplied to the tank's current size |
| Offset Angle     | `0.0`  | The default angle of the triangle. The offset - in radians                     |
| Radians Per Tick | `0.17` | The triangle's rotation per tick, in radians                                   |

**Object 2:**
| Key              | Value   | Desc                                                                           |
| ---------------- | ------- | ------------------------------------------------------------------------------ |
| Sides            | `3`     | The second shape of a spike addon is also a triangle                           |
| Size Ratio       | `1.3`   | The triangle's size in game is the ratio multiplied to the tank's current size |
| Offset Angle     | `π / 3` | The default angle of the triangle. The offset - in radians                     |
| Radians Per Tick | `0.17`  | The triangle's rotation per tick, in radians                                   |

**Object 3:**
| Key              | Value   | Desc                                                                           |
| ---------------- | ------- | ------------------------------------------------------------------------------ |
| Sides            | `3`     | The third shape of a spike addon is a triangle                                 |
| Size Ratio       | `1.3`   | The triangle's size in game is the ratio multiplied to the tank's current size |
| Offset Angle     | `π / 6` | The default angle of the triangle. The offset - in radians                     |
| Radians Per Tick | `0.17`  | The triangle's rotation per tick, in radians                                   |

**Object 4:**
| Key              | Value   | Desc                                                                           |
| ---------------- | ------- | ------------------------------------------------------------------------------ |
| Sides            | `3`     | The fourth shape of a spike addon is a triangle                                |
| Size Ratio       | `1.3`   | The triangle's size in game is the ratio multiplied to the tank's current size |
| Offset Angle     | `π / 2` | The default angle of the triangle. The offset - in radians                     |
| Radians Per Tick | `0.17`  | The triangle's rotation per tick, in radians                                   |

## Auto Smasher Addon

The Auto Smasher Addon has both a Guard Addon, and an Auto Turret.

**Object 1:** (Guard)
| Key              | Value  | Desc                                                                          |
| ---------------- | ------ | ----------------------------------------------------------------------------- |
| Sides            | `6`    | The shape of the first object in the Auto Smasher addon is a hexagon          |
| Size Ratio       | `1.15` | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.1`  | The hexagon's rotation per tick, in radians                                   |

**Object 2:** See the [Auto Turret Addon](#auto-turret-addon)

## Auto Turret Addon

Auto Turret is a mounted turret controlled by AI. Its shape was only somewhat able to be reduced from the memory.

| Key                | Value  | Desc                                                                           |
| ------------------ | ------ | ------------------------------------------------------------------------------ |
| Turret Width Ratio | `1.1`  | The length (longer side) of the turret barrel is `1.1x` the radius of the tank |
| Turret Size Ratio  | `0.56` | The size of the turret barrel is `0.56x` the radius of the tank                |
| Turret Base Ratio  | `0.5`  | The radius of the base is half the radius of the tank                          |

## Auto 5 Addon

## Auto 3 Addon

## Pronounced Addon

## Destroyer Dominator Pronounced Addon

## Gunner Dominator Pronounced Addon

## Launcher Addon

Launcher is a smaller trapezoid shape below the front of a tank - see the below picture. It is added before the barrel. <br> <img width="256" alt="lancher" src="https://user-images.githubusercontent.com/79597906/134366650-58c537cc-816a-4e4b-bf9d-0c97310b0a16.png"> <br> (Skimmer's barrel has been made opaque for viewing purposes).

| Key                  | Value   | Desc                                                                      |
| -------------------- | ------- | ------------------------------------------------------------------------- |
| Launcher Width Ratio | `1.3`   | The length (longer side) of the launcher is `1.1x` the radius of the tank |
| Launcher Size Ratio  | `0.672` | The width of the launcher is `0.56x` the radius of the tank               |
