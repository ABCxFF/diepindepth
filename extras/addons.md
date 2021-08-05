# Addon Information

Raw values and other information about addons in tank definitions.

- [`dombase`](#dominator-base-addon)
- [`smasher`](#smasher-addon)
- [`landmine`](#landmine-addon)
- [`spike`](#spike-addon)
- [`autosmasher`](#auto-smasher-addon)
- [`autoturret`](#auto-turret-addon)
- [`auto5`](#auto-5-addon)
- [`auto3`](#auto-3-addon)
- [`pronounced`](#pronounced-addon)
- [`destroyerdompronounced`](#destroyer-dominator-pronounced-addon)
- [`gunnerdompronounced`](#gunner-dominator-pronounced-addon)
- [`launcher`](#launcher-addon)

## Dominator Base Addon

What I like to call a Guard Addon, the Dominator Base Addon has one object attached to the player, that rotates separately from it - which is decided by the `motion.absoluteRotation` flag.

| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| Sides            | `6`     | The shape of a dombase addon is a hexagon                                     |
| Size Ratio       | `1.24`  | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.0`   | The hexagon's rotation per tick, in radians. Aka doesn't spin                 |

## Smasher Addon

Another Guard Addon. The Smasher Addon has one object attached to the player, that rotates separately from it.

| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| Sides            | `6`     | The shape of a smasher addon is a hexagon                                     |
| Size Ratio       | `1.15`  | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.1`   | The hexagon's rotation per tick, in radians                                   |

## Landmine Addon

Another Guard Addon. The Landmine Addon has two objects attached to the player, that rotate separately from it.

**Object 1:**
| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| Sides            | `6`     | The first shape of a landmine addon is a hexagon                              |
| Size Ratio       | `1.15`  | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.1`   | The hexagon's rotation per tick, in radians                                   |

**Object 2:**
| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| Sides            | `6`     | The second shape of a landmine addon is also a hexagon                        |
| Size Ratio       | `1.15`  | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.05`  | The hexagon's rotation per tick, in radians                                   |

## Spike Addon

Another Guard Addon. The Spike Addon has four objects attached to the player, that all rotate separately from it.

**Object 1:**
| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| Sides            | `3`     | The first shape of a spike addon is a triangle                                 |
| Size Ratio       | `1.3`   | The triangle's size in game is the ratio multiplied to the tank's current size |
| Offset Angle     | `0.0`   | The default angle of the triangle. The offset - in radians                     |
| Radians Per Tick | `0.17`  | The triangle's rotation per tick, in radians                                   |

**Object 2:**
| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| Sides            | `3`     | The second shape of a spike addon is also a triangle                           |
| Size Ratio       | `1.3`   | The triangle's size in game is the ratio multiplied to the tank's current size |
| Offset Angle     | `π / 3` | The default angle of the triangle. The offset - in radians                     |
| Radians Per Tick | `0.17`  | The triangle's rotation per tick, in radians                                   |

**Object 3:**
| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
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
| Key              | Value   | Desc                                                                          |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| Sides            | `6`     | The shape of the first object in the Auto Smasher addon is a hexagon          |
| Size Ratio       | `1.15`  | The hexagon's size in game is the ratio multiplied to the tank's current size |
| Radians Per Tick | `0.1`   | The hexagon's rotation per tick, in radians                                   |

**Object 2:** (Auto Turret)
[Needs to be looked into further]

## Auto Turret Addon

## Auto 5 Addon

## Auto 3 Addon

## Pronounced Addon

## Destroyer Dominator Pronounced Addon

## Gunner Dominator Pronounced Addon

## Launcher Addon
