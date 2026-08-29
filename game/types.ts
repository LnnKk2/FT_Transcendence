/*tous les types necessaires pour le jeu*/

export type Coord =  {x: number, y: number};

export type ShipName = "carrier" | "cruiser" | "battleship" | "submarine" | "destroyer";

export type Ship = {
	name: ShipName,
	positions: Coord[]};

export type PlayerID = "P1" | "P2";

export type PlayerState = {playerID: PlayerID, ships: Ship[], shotsReceived: Coord[]};

export type Phase = "Placement" | "Playing" | "Finished";

export type ShipSpec = {name: ShipName, len: number};

export type GameConfig = {boardSize: number, fleet: ShipSpec[]};

export type GameState = {
	config: GameConfig,
	phase: Phase,
	players: PlayerState[],
	turn: PlayerID,
	winner: PlayerID | null};

export type ShotResult = "miss" | "hit" | "sunk";
