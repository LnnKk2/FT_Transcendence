import type { GameState, PlayerID, Coord } from "./types.ts";
import {
	sameCoord,
	contains,
	isInside,
	buildPositions,
	opponentOf,
	getPlayer,
	DEFAULT_CONFIG,
	createGame,
} from "./engine.ts";

let passed = 0;
let failed = 0;

function check(label: string, actual: unknown, expected: unknown): void {
	const a = JSON.stringify(actual);
	const e = JSON.stringify(expected);
	if (a === e) {
		passed++;
		console.log(`OK   ${label}`);
	} else {
		failed++;
		console.log(`FAIL ${label} | attendu ${e} | obtenu ${a}`);
	}
}

// --- un etat de partie ecrit a la main ---
const state: GameState = {
	config: {
		boardSize: 10,
		fleet: [
			{ name: "carrier", len: 5 },
			{ name: "battleship", len: 4 },
			{ name: "cruiser", len: 3 },
			{ name: "submarine", len: 3 },
			{ name: "destroyer", len: 2 },
		],
	},
	phase: "Placement",
	players: [
		{
			playerID: "P1",
			ships: [{ name: "destroyer", positions: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }],
			shotsReceived: [],
		},
		{
			playerID: "P2",
			ships: [],
			shotsReceived: [{ x: 5, y: 5 }],
		},
	],
	turn: "P1",
	winner: null,
};

// le meme, mais avec les joueurs dans l'ordre inverse
const reversed: GameState = { ...state, players: [state.players[1], state.players[0]] };

// --- sameCoord ---
check("sameCoord identiques", sameCoord({ x: 1, y: 2 }, { x: 1, y: 2 }), true);
check("sameCoord x et y inverses", sameCoord({ x: 1, y: 2 }, { x: 2, y: 1 }), false);
check("sameCoord origine", sameCoord({ x: 0, y: 0 }, { x: 0, y: 0 }), true);
check("sameCoord un seul axe differe", sameCoord({ x: 3, y: 4 }, { x: 3, y: 5 }), false);

// --- contains ---
const list: Coord[] = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
check("contains present", contains(list, { x: 2, y: 2 }), true);
check("contains absent", contains(list, { x: 9, y: 9 }), false);
check("contains liste vide", contains([], { x: 0, y: 0 }), false);
check("contains compare le contenu", contains(list, { x: 3, y: 3 }), true);
check("contains coords croisees", contains(list, { x: 1, y: 2 }), false);

// --- isInside (grille 10x10) ---
check("isInside coin haut gauche", isInside({ x: 0, y: 0 }, 10), true);
check("isInside coin bas droite", isInside({ x: 9, y: 9 }, 10), true);
check("isInside x hors grille", isInside({ x: 10, y: 0 }, 10), false);
check("isInside y hors grille", isInside({ x: 5, y: 10 }, 10), false);
check("isInside x negatif", isInside({ x: -1, y: 5 }, 10), false);
check("isInside y negatif", isInside({ x: 5, y: -1 }, 10), false);

// --- buildPositions ---
check("buildPositions 3 en H", buildPositions({ x: 2, y: 3 }, 3, "H"),
	[{ x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }]);
check("buildPositions 3 en V", buildPositions({ x: 2, y: 3 }, 3, "V"),
	[{ x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }]);
check("buildPositions longueur 1", buildPositions({ x: 7, y: 7 }, 1, "H"), [{ x: 7, y: 7 }]);
check("buildPositions carrier au bord", buildPositions({ x: 5, y: 5 }, 5, "H"),
	[{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }]);
check("buildPositions ne valide rien", buildPositions({ x: 8, y: 0 }, 3, "H"),
	[{ x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }]);

// --- opponentOf ---
check("opponentOf P1", opponentOf("P1"), "P2");
check("opponentOf P2", opponentOf("P2"), "P1");

// --- getPlayer ---
check("getPlayer P1", getPlayer(state, "P1").playerID, "P1");
check("getPlayer P2", getPlayer(state, "P2").playerID, "P2");
check("getPlayer P1 a 1 navire", getPlayer(state, "P1").ships.length, 1);
check("getPlayer P2 a 1 tir recu", getPlayer(state, "P2").shotsReceived.length, 1);
check("getPlayer ordre inverse P1", getPlayer(reversed, "P1").playerID, "P1");
check("getPlayer ordre inverse P2", getPlayer(reversed, "P2").playerID, "P2");

let threw = false;
try {
	getPlayer(state, "P3" as PlayerID);
} catch {
	threw = true;
}
check("getPlayer id inconnu -> throw", threw, true);

// --- DEFAULT_CONFIG ---
check("config taille de grille", DEFAULT_CONFIG.boardSize, 10);
check("config 5 navires", DEFAULT_CONFIG.fleet.length, 5);
check("config 17 cases au total",
	DEFAULT_CONFIG.fleet.reduce((total, s) => total + s.len, 0), 17);

// --- createGame ---
const g = createGame(DEFAULT_CONFIG);

check("createGame phase de depart", g.phase, "Placement");
check("createGame pas de vainqueur", g.winner, null);
check("createGame 2 joueurs", g.players.length, 2);
check("createGame P1 present", getPlayer(g, "P1").playerID, "P1");
check("createGame P2 present", getPlayer(g, "P2").playerID, "P2");
check("createGame P1 sans navire", getPlayer(g, "P1").ships.length, 0);
check("createGame P2 sans navire", getPlayer(g, "P2").ships.length, 0);
check("createGame P1 sans tir recu", getPlayer(g, "P1").shotsReceived.length, 0);
check("createGame garde la config", g.config.fleet.length, 5);

// le premier joueur : par defaut P1, sinon celui qu'on passe
check("createGame turn par defaut", g.turn, "P1");
check("createGame turn force a P2", createGame(DEFAULT_CONFIG, "P2").turn, "P2");
check("createGame turn force a P1", createGame(DEFAULT_CONFIG, "P1").turn, "P1");

// deux parties doivent etre independantes : pas de tableau partage
const g1 = createGame(DEFAULT_CONFIG);
const g2 = createGame(DEFAULT_CONFIG);
check("2 parties = 2 objets distincts", g1 === g2, false);
check("2 parties = 2 listes de navires distinctes",
	g1.players[0].ships === g2.players[0].ships, false);
check("P1 et P2 ne partagent pas leur liste",
	g1.players[0].ships === g1.players[1].ships, false);

console.log(`\n${passed} OK, ${failed} FAIL`);
