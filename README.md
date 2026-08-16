# ft_transcendence

Last group project of the 42 common core.

## The game

Instead of the classic Pong, we chose **Battleship** (naval battle).
Each player places a fleet on their own grid, then both take turns firing at
coordinates until one fleet is completely sunk.

### Game modes

- **Local** — two players on the same machine, hot-seat style.
- **LAN** — play against another player on the same network.
- **vs AI** — play against a trained AI opponent.

### Technical stack

- Backend -> NestJS (TypeScript)
- Frontend -> React + TypeScript
- Infra -> Docker + Nginx
- Auth -> JWT + OAuth 2.0, 2FA

### Progress

- [x] Game chosen, rules and grid format defined
- [ ] Board rendering and fleet placement
- [ ] Turn logic and win condition
- [ ] LAN mode
- [ ] AI opponent

> Work in progress — this README is updated as the project advances.
