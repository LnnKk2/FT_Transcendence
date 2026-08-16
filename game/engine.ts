import { GamepadIcon } from "lucide-react";
import type { Coord, ShipName, Ship, PlayerID, PlayerState, Phase, ShipSpec, GameConfig, GameState }
from "./types.ts"
export type Orientation = "H" | "V";


///////////////////////////////////////////////
//            BASE CORE FUNCTIONS            //
///////////////////////////////////////////////

// obliger de comparer x et y car si on fait a === b on compare l identite pas le contenu
export function sameCoord(a: Coord, b: Coord): boolean {
	return a.x === b.x && a.y === b.y;
}

// `.some()` = "est-ce qu'AU MOINS UN element verifie ceci ?"
// L'equivalent d'une boucle for + return true, en une ligne.
export function contains(list: Coord[], c: Coord): boolean {
	return list.some((item) => sameCoord(item, c));
}

export function isInside(c: Coord, boardSize: number): boolean {
  return c.x >= 0 && c.x < boardSize && c.y >= 0 && c.y < boardSize;
}

// Fabrique les cases d'une rangee a partir d'un depart + orientation.
// H et V c est l orientation -> H = horizontal, V = vertical
export function buildPositions(start: Coord, length: number, dir: Orientation): Coord[] {
  const positions: Coord[] = [];
  for (let i = 0; i < length; i++) {
	positions.push({
	  x: dir === "H" ? start.x + i : start.x,
	  y: dir === "V" ? start.y + i : start.y,
	});
  }
  return positions;
}

// return l id du player qui doit faire l action (tirer par exemple)
export function opponentOf(id: PlayerID): PlayerID {
	return id === "P2" ? "P1" : "P2";
}

// la fonction find prend un tableau et en gros la je met p et ca va appeler la fonction pour chaque element du tableau
// exemple :
// tour 1 : p = state.players[0]  -> p.playerID === id ?  faux
// tour 2 : p = state.players[1]  -> p.playerID === id ?  vrai -> stop, renvoie cet elem
export function getPlayer(state: GameState, id: PlayerID): PlayerState
{
	const found = state.players.find((p) => p.playerID === id)
	if (found === undefined) throw new Error("unknown player: " + id);
	return found;
}


///////////////////////////////////////////////
//               DEFAULT CONFIG              //
///////////////////////////////////////////////

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
