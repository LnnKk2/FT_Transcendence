import type { Coord, Ship, PlayerID, PlayerState, GameState, ShotResult } from "../types.ts";
import { contains, isInside, opponentOf, getPlayer } from "./core.ts";

// return true si toutes les cases du bateau passe en parametre sont touchees, non sinon
export function isSunk(ship: Ship, shots: Coord[]): boolean
{
	return ship.positions.every((g) => contains(shots, g));
}

// return le bateau qui occuppe la case c si il y en a un, si la case est pas occuppee, return undefined
export function shipAt(player: PlayerState, c: Coord): Ship | undefined
{
	return player.ships.find((s) => contains(s.positions, c));
}

export function fireAt(state: GameState, shooter: PlayerID, shot: Coord): ShotResult | null
{
	const opponent = getPlayer(state, opponentOf(shooter));
	if(state.phase !== "Playing")
		return null;
	if(state.turn !== shooter)
		return null;
	if(!isInside(shot, state.config.boardSize))
		return null;
	if(contains(opponent.shotsReceived, shot))
		return null;
	opponent.shotsReceived.push(shot);
	const ship = shipAt(opponent, shot);
	let result: ShotResult;
	if(ship === undefined)
		result = "miss";
	else if(isSunk(ship, opponent.shotsReceived))
		result = "sunk";
	else
		result = "hit";
	if(result === "sunk" && (opponent.ships.every((s) => isSunk(s, opponent.shotsReceived) === true)))
	{
		state.phase = "Finished";
		state.winner = shooter;
		return result;
	}
	state.turn = opponent.playerID;
	return result;
}
