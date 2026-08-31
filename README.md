# ft_transcendence

Last group project of the 42 common core.

## The game

Instead of the classic Pong, we chose **Battleship** (naval battle).
Each player places a fleet on their own grid, then both take turns firing at
coordinates until one fleet is completely sunk.

Full rules: [`docs/game-rules.md`](docs/game-rules.md).
Module plan for the subject: [`docs/modules.md`](docs/modules.md).

### Game modes

- **Local** — two players on the same machine, hot-seat style.
- **LAN** — play against another player on the same network.
- **vs AI** — play against a trained AI opponent.

### Technical stack

- Backend -> NestJS (TypeScript)
- Frontend -> React + TypeScript
- Infra -> Docker + Nginx
- Auth -> JWT + OAuth 2.0, 2FA

Only the shared game engine exists so far; the rest of the stack is the plan,
not yet started.

## Repository

```
shared/src/types.ts       all the game types (Coord, Ship, GameState...)
shared/src/engine/        the rules engine, pure TypeScript, no dependency
  config.ts               default config (10x10, 5 ships) and createGame
  core.ts                 coordinate helpers (sameCoord, isInside, getPlayer...)
  placement.ts            canPlace / placeShip / isFleetComplete / startPlaying
  firing.ts               fireAt / isSunk / shipAt
shared/tests/             home-made runner, no test framework
docs/                     rules and module breakdown
```

The engine is shared on purpose: the backend will be the referee and the
frontend will reuse the same functions to preview a placement or grey out an
already-fired cell.

### Engine state

A game runs from end to end today: create a game, place the five ships for both
players, start the match, then alternate shots until a fleet is sunk. Illegal
moves (out of the grid, overlap, wrong phase, wrong turn, cell already fired)
are rejected without changing the state.

Missing: random fleet placement, and the AI opponent that will use it.

## Tests

```sh
npm test
```

109 checks over the engine (coordinates, placement, firing, win condition),
run by a small home-made runner — no external dependency.

## Progress

- [x] Game chosen, rules and grid format defined
- [x] Shared types and game engine
- [x] Fleet placement (rules side)
- [x] Turn logic and win condition
- [x] Engine test suite
- [ ] Random fleet placement
- [ ] Backend (NestJS) and database
- [ ] Frontend and board rendering
- [ ] LAN mode
- [ ] AI opponent

> Work in progress — this README is updated as the project advances.
