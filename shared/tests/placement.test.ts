import type { GameState, PlayerID, GameConfig } from "../src/types.ts";
import {
	getPlayer, DEFAULT_CONFIG, createGame,
	canPlace, placeShip, isFleetComplete, startPlaying,
} from "../src/index.ts";
import { check } from "./check.ts";
import { partiePrete } from "./fixtures.ts";

//////
//                 PLACEMENT                 //
///////////////////////////////////////////////

const pl = createGame(DEFAULT_CONFIG);

check("canPlace destroyer libre", canPlace(pl, "P1", "destroyer", { x: 0, y: 0 }, "H"), true);
check("placeShip destroyer", placeShip(pl, "P1", "destroyer", { x: 0, y: 0 }, "H"), true);
check("P1 a 1 bateau", getPlayer(pl, "P1").ships.length, 1);
check("positions enregistrees", getPlayer(pl, "P1").ships[0].positions,
	[{ x: 0, y: 0 }, { x: 1, y: 0 }]);
check("orientation V respectee",
	(placeShip(pl, "P1", "cruiser", { x: 5, y: 5 }, "V"), getPlayer(pl, "P1").ships[1].positions),
	[{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }]);

check("meme bateau deux fois", placeShip(pl, "P1", "destroyer", { x: 8, y: 8 }, "H"), false);
check("chevauchement", placeShip(pl, "P1", "carrier", { x: 1, y: 0 }, "H"), false);
check("hors grille a droite", placeShip(pl, "P1", "carrier", { x: 8, y: 0 }, "H"), false);
check("hors grille en bas", placeShip(pl, "P1", "carrier", { x: 0, y: 8 }, "V"), false);
check("depart negatif", placeShip(pl, "P1", "carrier", { x: -1, y: 9 }, "H"), false);
check("aucun bateau ajoute par les refus", getPlayer(pl, "P1").ships.length, 2);

check("bateaux qui se touchent", placeShip(pl, "P1", "battleship", { x: 2, y: 0 }, "H"), true);
check("P1 ne gene pas P2", placeShip(pl, "P2", "destroyer", { x: 0, y: 0 }, "H"), true);

///////////////////////////////////////////////
//           FLOTTE COMPLETE / DEPART        //
///////////////////////////////////////////////


check("flotte incomplete", isFleetComplete(pl, "P1"), false);
check("startPlaying refuse si incomplet", startPlaying(pl), false);
check("phase inchangee apres refus", pl.phase, "Placement");

const pr = partiePrete();
check("P1 flotte complete", isFleetComplete(pr, "P1"), true);
check("P2 flotte complete", isFleetComplete(pr, "P2"), true);
check("startPlaying accepte", startPlaying(pr), true);
check("phase passee a Playing", pr.phase, "Playing");
check("placement verrouille", canPlace(pr, "P1", "carrier", { x: 0, y: 9 }, "H"), false);
check("startPlaying deux fois", startPlaying(pr), false);

// isFleetComplete lit la config, il n'y a pas de 5 code en dur
const mini: GameConfig = { boardSize: 8, fleet: [{ name: "destroyer", len: 2 }] };
const gm = createGame(mini);
check("config a 1 bateau : rien pose", isFleetComplete(gm, "P1"), false);
placeShip(gm, "P1", "destroyer", { x: 0, y: 0 }, "H");
check("config a 1 bateau : pose", isFleetComplete(gm, "P1"), true);

/////////////////////////////////////////