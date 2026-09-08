import type { CellView } from "../src/types.ts";
import { fireAt, startPlaying, viewFor } from "../src/index.ts";
import { check } from "./check.ts";
import { partiePrete } from "./fixtures.ts";

// compte les cases d un etat donne sur toute la grille
const compte = (board: CellView[][], want: CellView): number =>
	board.flat().filter((c) => c === want).length;

const v = partiePrete();
startPlaying(v);

// P1 tire 3 fois ; P2 tire entre chaque pour rendre la main
fireAt(v, "P1", { x: 0, y: 0 });   // touche le carrier
fireAt(v, "P2", { x: 9, y: 9 });
fireAt(v, "P1", { x: 9, y: 0 });   // a l'eau
fireAt(v, "P2", { x: 9, y: 8 });
fireAt(v, "P1", { x: 0, y: 4 });   // touche le destroyer

const p1 = viewFor(v, "P1");

///////////////////////////////////////////////
//        brouillard de guerre (le test)     //
///////////////////////////////////////////////

check("aucun bateau adverse revele", compte(p1.enemyBoard, "ship"), 0);
check("aucune case adverse dite vide", compte(p1.enemyBoard, "empty"), 0);
check("3 tirs -> 3 cases connues", 100 - compte(p1.enemyBoard, "unknown"), 3);
check("case visee et touchee", p1.enemyBoard[0][0], "hit");
check("case visee a l'eau", p1.enemyBoard[0][9], "miss");
check("case jamais visee", p1.enemyBoard[5][5], "unknown");
// le carrier adverse occupe (1,0) a (4,0) : jamais vise -> doit rester cache
check("bateau adverse non vise reste cache", p1.enemyBoard[0][1], "unknown");

///////////////////////////////////////////////
//                 ma grille                 //
///////////////////////////////////////////////

check("rien d'inconnu chez moi", compte(p1.myBoard, "unknown"), 0);
check("mes 17 cases de bateau", compte(p1.myBoard, "ship"), 17);
check("les 2 tirs recus sont a l'eau", compte(p1.myBoard, "miss"), 2);
check("une case vide reste vide", p1.myBoard[5][5], "empty");

///////////////////////////////////////////////
//              coule + entetes              //
///////////////////////////////////////////////

check("phase reportee", p1.phase, "Playing");
check("apres mon tir, ce n'est plus mon tour", p1.myTurn, false);
check("pas de vainqueur", p1.winner, null);
check("la vue sait qui elle sert", p1.me, "P1");
// vu d'en face, la meme partie : P2 n'a vise que 2 cases
check("la vue de P2 est distincte", 100 - compte(viewFor(v, "P2").enemyBoard, "unknown"), 2);
check("c'est le tour de P2", viewFor(v, "P2").myTurn, true);

// on coule le destroyer adverse : (0,4) est deja touche, il reste (1,4)
fireAt(v, "P2", { x: 8, y: 8 });
fireAt(v, "P1", { x: 1, y: 4 });
const apres = viewFor(v, "P1");

check("les 2 cases du destroyer passent a sunk", apres.enemyBoard[4][0], "sunk");
check("l'autre case du destroyer aussi", apres.enemyBoard[4][1], "sunk");
check("le carrier touche reste hit", apres.enemyBoard[0][0], "hit");
check("couler ne revele rien d'autre", compte(apres.enemyBoard, "ship"), 0);
