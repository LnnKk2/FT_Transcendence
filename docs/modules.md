# ft_transcendence modules — subject v21.1

Target: **14 points**. Major = 2 pts, minor = 1 pt.
The subject recommends aiming above 14, in case a module fails to validate
during evaluation. A non-functional or incomplete module scores **0 points**.

---

## Proposed plan for the battleship game (17 pts)

| Module | Category | Type | Pts |
|---|---|---|---|
| Framework for both frontend **and** backend | Web | Major | 2 |
| Real-time features via WebSockets | Web | Major | 2 |
| ORM | Web | Minor | 1 |
| Complete web-based game (battleship) | Gaming | Major | 2 |
| Remote players (two machines, real-time) | Gaming | Major | 2 |
| Tournament system | Gaming | Minor | 1 |
| AI opponent | AI | Major | 2 |
| Standard user management | User Mgmt | Major | 2 |
| Game statistics + match history | User Mgmt | Minor | 1 |
| OAuth 2.0 | User Mgmt | Minor | 1 |
| 2FA | User Mgmt | Minor | 1 |
| | | **Total** | **17** |

Three of these modules come almost for free with the chosen stack: NestJS +
React validates the "framework frontend and backend" major, TypeORM covers the
ORM minor, and WebSockets are needed for online play anyway. That is 5 points
with virtually no extra work.

Dependencies are satisfied: tournament, statistics and AI all require a
functional game first. **The game is therefore the critical path** — until it
runs, 5 points of this plan stay blocked.

---

## Full list

### Web

| Module | Type | Pts |
|---|---|---|
| Framework for both frontend **and** backend (full-stack counts as both) | Major | 2 |
| Real-time WebSockets (updates, (dis)connection handling, broadcasting) | Major | 2 |
| User interaction: basic chat + profiles + friends | Major | 2 |
| Public API: API key, rate limiting, docs, ≥5 CRUD endpoints | Major | 2 |
| Frontend framework alone | Minor | 1 |
| Backend framework alone | Minor | 1 |
| ORM | Minor | 1 |
| Notification system for every create / update / delete action | Minor | 1 |
| Real-time collaborative features (live editing, shared workspaces…) | Minor | 1 |
| Server-Side Rendering | Minor | 1 |
| PWA (offline support + installable) | Minor | 1 |
| Custom design system (≥10 components, palette, typography, icons) | Minor | 1 |
| Advanced search (filters, sorting, pagination) | Minor | 1 |
| File upload and management (validation, secure storage, preview) | Minor | 1 |

The two minors "frontend framework" and "backend framework" are worth 1+1 = 2,
the same as the major covering both. Take the major — it is the same work.

### Accessibility and internationalization

| Module | Type | Pts |
|---|---|---|
| Full WCAG 2.1 AA compliance (screen readers, keyboard navigation) | Major | 2 |
| Multilingual (≥3 complete languages + switcher) | Minor | 1 |
| RTL support (full layout mirroring, not just text direction) | Minor | 1 |
| Additional browsers (≥2 beyond Chrome) | Minor | 1 |

### User management

| Module | Type | Pts |
|---|---|---|
| Standard user management (profile, avatar, friends, online status) | Major | 2 |
| Advanced permissions (user CRUD, admin/user/guest/moderator roles) | Major | 2 |
| Organization system | Major | 2 |
| Game statistics + match history *(requires a game)* | Minor | 1 |
| OAuth 2.0 (Google, GitHub, 42…) | Minor | 1 |
| Complete 2FA | Minor | 1 |
| User activity analytics dashboard | Minor | 1 |

### Artificial intelligence

| Module | Type | Pts |
|---|---|---|
| AI opponent *(requires a game)* | Major | 2 |
| Complete RAG system | Major | 2 |
| Complete LLM interface (streaming, rate limiting) | Major | 2 |
| Recommendation system (ML) | Major | 2 |
| AI content moderation | Minor | 1 |
| Voice / speech integration | Minor | 1 |
| Sentiment analysis | Minor | 1 |
| Image recognition and tagging | Minor | 1 |

The AI opponent must be **challenging**, win occasionally, behave in a
human-like way (no perfect play), handle customization options if you implement
any, and you must be able to explain the algorithm during evaluation.

### Cybersecurity

| Module | Type | Pts |
|---|---|---|
| Hardened WAF/ModSecurity + HashiCorp Vault for secrets | Major | 2 |

### Gaming and user experience

| Module | Type | Pts |
|---|---|---|
| Complete web-based game, player vs player, clear rules and win conditions | Major | 2 |
| Remote players (two machines, latency, disconnections, reconnection) | Major | 2 |
| Multiplayer 3+ *(requires a game)* | Major | 2 |
| Second distinct game with history and matchmaking *(requires a first game)* | Major | 2 |
| Advanced 3D graphics (Three.js, Babylon.js) | Major | 2 |
| Advanced chat *(requires basic chat from the "user interaction" module)* | Minor | 1 |
| Tournament (bracket, matchmaking, registration) *(requires a game)* | Minor | 1 |
| Game customization (power-ups, maps, settings) *(requires a game)* | Minor | 1 |
| Gamification (≥3 of: achievements, badges, leaderboards, XP, challenges, rewards) | Minor | 1 |
| Spectator mode *(requires a game)* | Minor | 1 |

### DevOps

| Module | Type | Pts |
|---|---|---|
| ELK stack (Elasticsearch, Logstash, Kibana) | Major | 2 |
| Monitoring with Prometheus + Grafana (dashboards, alerting) | Major | 2 |
| Backend as microservices | Major | 2 |
| Health checks + status page + backups + disaster recovery | Minor | 1 |

### Data and analytics

| Module | Type | Pts |
|---|---|---|
| Analytics dashboard with data visualization (interactive charts, real-time, export) | Major | 2 |
| Data export / import (JSON, CSV, XML, bulk operations) | Minor | 1 |
| GDPR compliance (data access, deletion, export, confirmation emails) | Minor | 1 |

### Blockchain

| Module | Type | Pts |
|---|---|---|
| Tournament scores on blockchain (Avalanche + Solidity) | Major | 2 |
| Backend on ICP *(incompatible with SSR)* | Minor | 1 |

### Modules of choice

| Module | Type | Pts |
|---|---|---|
| Custom module not listed above, substantial and technically complex | Major | 2 |
| Same, smaller in scope | Minor | 1 |

Justification is mandatory in the README: why this module, what technical
challenges it addresses, what value it adds, why it deserves its status.
Trivial or rushed implementations are rejected.

---

## Dependencies to respect

- AI opponent, tournament, customization, spectator mode, multiplayer 3+, second game, game statistics → all **require a functional game**.
- Advanced chat → requires basic chat from the "Allow users to interact" module.
- SSR ↔ ICP backend: incompatible.

## Modules to avoid early on

ELK, Prometheus/Grafana, microservices, blockchain and WCAG 2.1 AA are expensive
in time for 2 points, and none of them gets you closer to the game that unlocks
everything else. Keep them in reserve if you end up ahead of schedule.
