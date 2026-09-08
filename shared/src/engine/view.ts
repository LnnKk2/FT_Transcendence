import type { Coord, PlayerID, PlayerState, GameState, CellView, GameView } from "../types.ts";
import { contains, getPlayer, opponentOf } from "./core.ts";
import { isSunk, shipAt } from "./firing.ts";

// etat d une case DEJA tiree. le calcul est le meme sur les deux grilles :
// c est exactement ce qu on a le droit de dire d une case visee
function shotCell(player: PlayerState, c: Coord): CellView
{
	const ship = shipAt(player, c);
	if(ship === undefined)
		return "miss";
	if(isSunk(ship, player.shotsReceived))
		return "sunk";
	return "hit";
}

// ma grille : je vois tout, mes bateaux comme les tirs que j ai recus
function myCell(mine: PlayerState, c: Coord): CellView
{
	if(contains(mine.shotsReceived, c))
		return shotCell(mine, c);
	return shipAt(mine, c) === undefined ? "empty" : "ship";
}

// grille adverse : une case que je n ai pas visee reste "unknown".
// cette branche ne consulte JAMAIS enemy.ships -> c est tout le brouillard de guerre.
function enemyCell(enemy: PlayerState, c: Coord): CellView
{
	if(contains(enemy.shotsReceived, c) === false)
		return "unknown";
	return shotCell(enemy, c);
}

// construit un tableau 2D indexe [y][x].
// `cell` est une FONCTION passee en parametre : buildBoard ne sait pas ce qu elle
// calcule, il se contente de l appeler sur chaque case. ca evite d ecrire
// deux fois la meme double boucle.
function buildBoard(boardSize: number, cell: (c: Coord) => CellView): CellView[][]
{
	const board: CellView[][] = [];
	for(let y = 0; y < boardSize; y++)
	{
		const row: CellView[] = [];
		for(let x = 0; x < boardSize; x++)
			row.push(cell({x: x, y: y}));
		board.push(row);
	}
	return board;
}

// tout ce qu un joueur a le droit de voir, pret a afficher.
// c est CET objet qui part vers le front, jamais le GameState.
export function viewFor(state: GameState, me: PlayerID): GameView
{
	const mine = getPlayer(state, me);
	const enemy = getPlayer(state, opponentOf(me));
	return {
		me: me,
		myBoard: buildBoard(state.config.boardSize, (c) => myCell(mine, c)),
		enemyBoard: buildBoard(state.config.boardSize, (c) => enemyCell(enemy, c)),
		phase: state.phase,
		myTurn: state.turn === me,
		winner: state.winner,
	};
}
