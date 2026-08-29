import type { GameConfig, GameState, PlayerID } from "../types.ts";

export const DEFAULT_CONFIG: GameConfig = {
	boardSize: 10,
	fleet: [
		{name: "carrier", len: 5},
		{name: "battleship", len: 4},
		{name: "cruiser", len: 3},
		{name: "submarine", len: 3},
		{name: "destroyer", len: 2},
	],
};

export function createGame(config: GameConfig, first: PlayerID = "P1"): GameState
{
	return{
		config: config,
		phase: "Placement",
		players: [
			{playerID: "P1", ships: [], shotsReceived: []},
			{playerID: "P2", ships: [], shotsReceived: []},
		],
		turn: first,
		winner: null,
	}
}
