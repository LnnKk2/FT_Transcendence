import type { Ship } from "../src/types.ts";
import { getPlayer, DEFAULT_CONFIG, isSunk, shipAt, fireAt, startPlaying } from "../src/index.ts";
import { check } from "./check.ts";
import { partiePrete } from "./fixtures.ts";

//////
//                  isSunk                   //
///////////////////////////////////////////////

const dst: Ship = { name: "destroyer", positions: [{ x: 0, y: 0 }, { x: 1, y: 0 }] };

check("isSunk aucun tir", isSunk(dst, []), false);
check("isSunk une seule case", isSunk(dst, [{ x: 0, y: 0 }]), false);
check("isSunk l'autre case", isSunk(dst, [{ x: 1, y: 0 }]), false);
check("isSunk les deux cases", isSunk(dst, [{ x: 0, y: 0 }, { x: 1, y: 0 }]), true);
check("isSunk avec des tirs en trop",
	isSunk(dst, [{ x: 9, y: 9 }, { x: 1, y: 0 }, { x: 5, y: 5 }, { x: 0, y: 0 }]), true);
check("isSunk tirs a cote seulement", isSunk(dst, [{ x: 9, y: 9 }, { x: 5, y: 5 }]), false);

///////////////////////////////////////////////
//                  shipAt                   //
///////////////////////////////////////////////

const sa = partiePrete();
const nomDe = (s: Ship | undefined) => s === undefined ? "undefined" : s.name;

check("shipAt debut du carrier", nomDe(shipAt(getPlayer(sa, "P1"), { x: 0, y: 0 })), "carrier");
check("shipAt fin du carrier", nomDe(shipAt(getPlayer(sa, "P1"), { x: 4, y: 0 })), "carrier");
check("shipAt milieu du cruiser", nomDe(shipAt(getPlayer(sa, "P1"), { x: 1, y: 2 })), "cruiser");
check("shipAt case vide", nomDe(shipAt(getPlayer(sa, "P1"), { x: 9, y: 9 })), "undefined");
check("shipAt juste apres un bateau", nomDe(shipAt(getPlayer(sa, "P1"), { x: 5, y: 0 })), "undefined");
check("shipAt x et y inverses", nomDe(shipAt(getPlayer(sa, "P1"), { x: 0, y: 5 })), "undefined");
check("shipAt joueur sans bateau",
	nomDe(shipAt({ playerID: "P2", ships: [], shotsReceived: [] }, { x: 0, y: 0 })), "undefined");

///////////////////////////////////////////////
//                  fireAt                   //
///////////////////////////////////////////////

const f = partiePrete();

check("fireAt refuse avant startPlaying", fireAt(f, "P1", { x: 0, y: 0 }), null);
startPlaying(f);

check("tir a l'eau", fireAt(f, "P1", { x: 9, y: 9 }), "miss");
check("le tour passe a P2", f.turn, "P2");
check("le tir est enregistre chez P2", getPlayer(f, "P2").shotsReceived, [{ x: 9, y: 9 }]);
check("P1 n'a rien recu", getPlayer(f, "P1").shotsReceived.length, 0);

check("P1 ne peut pas rejouer", fireAt(f, "P1", { x: 0, y: 0 }), null);
check("le tour n'a pas bouge", f.turn, "P2");

check("P2 touche le carrier", fireAt(f, "P2", { x: 0, y: 0 }), "hit");
check("retour a P1", f.turn, "P1");

check("hors grille", fireAt(f, "P1", { x: 10, y: 0 }), null);
check("hors grille : tour intact", f.turn, "P1");
check("hors grille : rien enregistre", getPlayer(f, "P2").shotsReceived.length, 1);

check("P1 touche le destroyer", fireAt(f, "P1", { x: 0, y: 4 }), "hit");
fireAt(f, "P2", { x: 8, y: 8 });
check("case deja tiree", (fireAt(f, "P1", { x: 0, y: 4 })), null);
check("case deja tiree : tour intact", f.turn, "P1");
check("P1 coule le destroyer", fireAt(f, "P1", { x: 1, y: 4 }), "sunk");
check("un bateau coule ne finit pas la partie", f.phase, "Playing");
check("pas encore de vainqueur", f.winner, null);

// partie complete : P1 coule les 17 cases, P2 tire dans le vide entre deux
const w = partiePrete();
startPlaying(w);

let n = 0;
for (let y = 0; y < DEFAULT_CONFIG.fleet.length; y++) {
	for (let x = 0; x < DEFAULT_CONFIG.fleet[y].len; x++) {
		fireAt(w, "P1", { x: x, y: y });
		if (w.phase === "Playing")
			fireAt(w, "P2", { x: n % 10, y: 8 + Math.floor(n / 10) });
		n++;
	}
}

check("17 cases touchees", getPlayer(w, "P2").shotsReceived.length, 17);
check("phase Finished", w.phase, "Finished");
check("vainqueur P1", w.winner, "P1");
check("plus de tir apres la fin", fireAt(w, "P1", { x: 7, y: 7 }), null);
check("P2 non plus", fireAt(w, "P2", { x: 7, y: 7 }), null);
check("les 5 bateaux de P2 sont coules",
	getPlayer(w, "P2").ships.every((s) => isSunk(s, getPlayer(w, "P2").shotsReceived)), true);
check("la flotte de P1 est intacte",
	getPlayer(w, "P1").ships.some((s) => isSunk(s, getPlayer(w, "P1").shotsReceived)), false);

