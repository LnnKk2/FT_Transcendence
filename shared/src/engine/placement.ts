import type { Coord, ShipName, Ship, PlayerID, PlayerState, ShipSpec, GameConfig, GameState, Orientation }
from "../types.ts";
import { contains, isInside, buildPositions, getPlayer } from "./core.ts";

export function specOf(config: GameConfig, name: ShipName): ShipSpec {
	const found = config.fleet.find((boat) => boat.name === name)
	if (found === undefined) throw new Error("unknown boat: " + name);
	return found;
}

// en gros la ligne 97 ca veut dire est ce que qlq part dans le champ name de s son nom est = a wanted
// c est une facon de chercher vu que some va chercher pour chaque objet du tableau dans le champ => s.name, il cherche sur name
export function isPlaced(player: PlayerState, wanted: ShipName): boolean {
	return player.ships.some((s) => s.name === wanted);
}

//  tout est dans le nom, repond a la question est ce que on peux placer le bateau la ?
// elle ne modifie rien, renvoie juste un boolean
// cette fonction peut etre appelee dans le front pour colorier la case la ou la souris hover
export function canPlace(state: GameState, id: PlayerID, name: ShipName, start: Coord, dir: Orientation): boolean
{
	const player = getPlayer(state, id);
	if(state.phase !== "Placement" || isPlaced(player, name))
		return false;
	const ShipData = specOf(state.config, name);
	const hoveredGrids = buildPositions(start, ShipData.len, dir);
	if(hoveredGrids.every((g) => isInside(g, state.config.boardSize)) !== true)
		return false;
	// toutes les cases deja prises par les bateaux DEJA poses, mises a plat
	const occupied = player.ships.flatMap((s) => s.positions);
	// au moins une de mes cases est elle dedans ? -> chevauchement -> refus
	if(hoveredGrids.some((g) => contains(occupied, g)))
		return false;
	return true;
}

export function placeShip(state: GameState, id: PlayerID, name: ShipName, start: Coord, dir: Orientation): boolean
{
	if(canPlace(state, id, name, start, dir) === false)
		return false;
	const player = getPlayer(state, id);
	const shipData = specOf(state.config, name);
	const boat: Ship = {
		name: name,
		positions: buildPositions(start, shipData.len, dir),
	};
	// ajoute le bateau a la liste du joueur (push modifie le tableau, ca n en cree pas un nouveau)
	player.ships.push(boat);
	return true;
}

// est ce que ce joueur a pose TOUS les bateaux demandes par la config ?
// ca parcourt la liste de ce qu'il FAUT poser (config.fleet), pas ce qui est deja pose
export function isFleetComplete(state: GameState, id: PlayerID): boolean
{
	const player = getPlayer(state, id);
	return state.config.fleet.every((spec) => isPlaced(player, spec.name));
}

export function startPlaying(state: GameState): boolean
{
	if(state.phase !== "Placement")
		return false;
	if(isFleetComplete(state, "P1") === false)
		return false;
	if(isFleetComplete(state, "P2") === false)
		return false;
	state.phase = "Playing";
	return true;
}
