# Battleship — game rules

Simple rules, as the real game: Two players, one hidden grid each. Sink the whole enemy fleet to win.

## Board

10 × 10. Columns `A`–`J`, rows `1`–`10` (a cell is written `B7`).

## Fleet

Same 5 ships for both players, 17 cells total.

| Ship | Length |
|---|---|
| Carrier | 5 |
| Battleship | 4 |
| Cruiser | 3 |
| Submarine | 3 |
| Destroyer | 2 |

## Placement

Each player places their 5 ships: horizontal or vertical, inside the grid, no
overlap. Ships may touch. Once both players are ready, nothing can move.

## Turns

Players alternate, one shot per turn, first player chosen randomly. A hit does
not give an extra shot.

A shot returns **miss**, **hit**, or **sunk** (the ship type is then announced
and its position revealed). Firing twice at the same cell is rejected and does
not consume the turn.

## Winning

All 5 enemy ships sunk — or the opponent forfeits or disconnects. No draw.

## Visibility

A player sees their own ships, the shots they received, and the results of the
shots they fired. An enemy ship's position is never sent before it is sunk.
