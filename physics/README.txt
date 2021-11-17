


                         Diep.io Physics
                               ABC


    I will only share what I have discovered or proven myself

=================================================================

———————————————————————— §1 Introduction ————————————————————————

———————————————————————— §2 Entity Sizes ————————————————————————

Size is a field in an entity's physics field group in diep.io. It
is  the  radius  used  for  collision  calculation  in  game. All
entities (except  Maze  Walls,  Bases,  and  Arenas) are  circles
during collision calculation.

§2.1 Shape Sizes (Collision Radi)
Name ————————————: Rounded ——: Value ———
 Square          : 38.890872 : 55√2 / 2
 Triangle        : 38.890872 : 55√2 / 2
 Crasher (small) : 24.748737 : 35√2 / 2
 Crasher (large) : 38.890872 : 55√2 / 2
 Pentagon        : 53.033008 : 75√2 / 2
 Alpha Pentagon  : 141.42135 : 200√2/ 2
—————————————————:———————————:——————————

§2.2 Tank Sizes
—————————————————:———————————————————————
Tank Size Factor : 1.01 ^ (lvl - 1)
AC Size Factor   : Tank Size Factor(AC lvl) * 3.5
Body Size        : sizeFactor * baseSize
Where
  : baseSize for a 16 sided tank = 25√2
  : baseSize for a 4 sided tank  = 32.5√2

§2.2 Rectangular Sizes

As mentioned  before, rectangular entities  such as Maze Walls do 
not work the same as  entities  of 1  or 3+ sides. Rectangles use
two properties  instead  of  one to  determine  overall size. The
width property and the  height  property. In the game's protocol,
the height  property  reuses  the  normal  size  property, so its
purpose changes depending  on  side  count. The width property is
the entity's  full  width, and  its  height  property is its full
height. Keep in mind that all  entities by default are rotated at
0rad (radians), so the larger  the  height, the wider it looks by
default / without rotation.

—————————————————————————— §3 Movement ——————————————————————————

All movement in the game share similar properties, but the entity
type ultimately  determines  how  it moves. Firstly, all entities
have a 10% friction  rate - meaning  that all velocity is reduced
10% each tick. The following  formula  defines the movement of an
entity which was previously moving at the speed of 10du/t after n
ticks, where n ≥ 0.

ƒ(n) = 10 * 0.9^n (du/t)

Friction is constant and is applied before the first physics calc
ulation in a tick.

§3.1 Reduction from Angle Difference

I didn't research or prove this myself, so I will not explain it.

§3.2 Tank Acceleration

See the  desmos  graphs  at  desmos.com/calculator/begleuv7di for
information, since I don't want to explain something I've already
described in a visual form (I'll still put the formulas below for
the sake of having them there).

Base Acceleration = A_0
Movement Speed Stat = m_s
Level = l

A_0 = 2.55 * (1.07^m_s) / 1.015^(l-1) (du/t)

§3.3 Max Speed Calculation

After opening the  desmos  graph, you  will see that the equation 
for entity speed with A acceleration after n ticks is:

ƒ(n) = 10 * A * (1 - 0.9^n) (du/t)

It is very easy, after  looking  at this  formula, to see that as
parameter n approaches infinity, the  result of the function will
get closer  to 10 * A. And  so, the  formula  for  max speed from
acceleration A is 10 * A.

§3.4 Shape Velocity

Never looked into this fully.

§3.5 Projectile Acceleration

§3.5.1 Bullet (Fundamental) Speed

The speed of a bullet  is determined by its initial speed and its
base acceleration that goes on  throughout the bullets life time.
The initial  speed of  a  bullet  is  30du/t + the  bullet's base
acceleration  max  speed (§3.3). See  below for the formula for a
bullet's base acceleration:

Bullet Acceleration = b_A
Bullet Speed Stat = b_s
Bullet Definition Speed (see /extras/tankdefs.js) = B_S

b_A = (2 + b_s * 0.3) * B_S (du/t)

and so bullet initial speed is equal to A * 10 + 30 (du/t).

The bullet  acceleration  and  initial  speed  is  present in all
projectiles, with  Traps  being  an  exception  (see  §3.5.2). In
Drones, the  bullet  acceleration  and  initial speed are used to
determine speed the drone travels at each direction.

§3.5.2 Trap Speed

Traps are just  bullets  without base  acceleration, which is why
they stop moving shortly after they fire.

§3.6 Recoil

Recoil is the  acceleration  applied  to a tank after it shoots a
bullet. Recoil's direction is the opposite of the barrel's angle,
and the actual  acceleration  applied  at  that angle is equal to
this equation:

Bullet Definition Recoil (see /extras/tankdefs.js) = B_R
Bullet Recoil (Acceleration) = b_R

b_R = 2 * B_R (t/s)

————————————————————————— §4 Knockback ——————————————————————————

§4.1 General Knockback

There are two properties  that  determine the knockback an entity
receives after a  collision. We have  named them `pushFactor` and 
`absorbtionFactor`. The knockback applied to an entity is simple.

Entity1's absorbtionFactor = e1_aF
Entity2's pushFactor = e2_pF
Entity1's Knockback Receival (Acceleration) = e1_A

e1_A = e_aF * e2_pF (t/s)

Where e1_A is the knockback in  form of acceleration  applied to
Entity1 after  colliding  with  Entity2. See  §4.3 for a list of
entities   along   with   their    respective   pushFactor   and
absorbtionFactor.

§4.2 Maze Wall Knockback

Haven't fully looked into yet.

§4.3 Entity pushFactor and absorbtionFactor values

§4.3.1 Constants

— Entity "Type" ———————————: pushFactor ———: absorbtionFactor ———
 default                   : 8.0           : 1.0                  
 Mothership (tank too)     : 8.0           : 0.01                 
 Bosses                    : 8.0           : 0.01                 
 Arena Closers             : 8.0           : 0.0                  
 Maze Walls                : 2.0           : 0.0                  
 Crasher (small)           : 12.0          : 2.0                  
 Crasher (large)           : 12.0          : 0.1                  
 Pentagon                  : 11.0          : 0.5                  
 Alpha Pentagon            : 11.0          : 0.05                 
 Drone (factory+necro too) : 4.0           :                      
———————————————————————————:———————————————:—————————————————————

§4.3.2 Bullet Factors

Bullet Damage Stat = b_DS
Bullet Damage (see /extras/tankdefs.js) = B_D
Bullet Absorbtion Factor (see /extras/tankdefs.js) = B_aF

pushFactor = (7 / 3 + b_DS) * B_D
absorbtionFactor = B_aF

Absorbtion factor is almost always 1 except for a couple of speci
al cases. 

——————————————————————————— §5 Damage ———————————————————————————

———————————————————————————— §6 Misc ————————————————————————————

$6.1 Barrel Reload

§6.2 Bullet Life Length

§6.3 Death Animation
