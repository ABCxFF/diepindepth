


                         Diep.io Physics
                               ABC


    I will only share what I have discovered or proven myself

=================================================================

——————————————————————— §2 — Entity Sizes ———————————————————————

Size is a field in an entity's physics field group in diep.io. It
is the radius used for collision calculation in game. All entitie
s (except Maze Walls, Bases, and Arenas) are circles during colli
sion calculation.

Shape Sizes (Collision Radi)
Name ————————————: Rounded ——: Value ———
 Square          : 38.890872 : 55√2 / 2
 Triangle        : 38.890872 : 55√2 / 2
 Crasher (small) : 24.748737 : 35√2 / 2
 Crasher (large) : 38.890872 : 55√2 / 2
 Pentagon        : 53.033008 : 75√2 / 2
 Alpha Pentagon  : 141.42135 : 200√2/ 2
—————————————————:———————————:——————————

Tank Sizes
—————————————————:———————————————————————
Tank Size Factor : 1.01 ^ (lvl - 1)
AC Size Factor   : Tank Size Factor(AC lvl) * 3.5
Body Size        : sizeFactor * baseSize
Where
  : baseSize for a 16 sided tank = 25√2
  : baseSize for a 4 sided tank  = 32.5√2
