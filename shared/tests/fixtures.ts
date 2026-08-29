import type { GameState, PlayerID } from "../src/types.ts";
import { DEFAULT_CONFIG, createGame, placeShip } from "../src/index.ts";

// une partie prete a jouer : chaque bateau sur sa propre ligne, en H
// carrier (0,0)-(4,0) | battleship (0,1)-(3,1) | cruiser (0,2)-(2,2)
// submarine (0,3)-(2,3) | destroyer (0,4)-(1,4)     -> lignes 5 a 9 vides
export function partiePrete(): GameState {
	const g = createGame(DEFAULT_CONFIG);
	for (const id of ["P1", "P2"] as PlayerID[])
		DEFAULT_CONFIG.fleet.forEach((spec, i) => placeShip(g, id, spec.name, { x: 0, y: i }, "H"));
	return g;
}
