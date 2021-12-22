import Solver from './Solver';

class Die {
	constructor() {
		this.value = 100;
		this.rolls = 0;
	}

	roll() {
		this.value = this.value % 100;
		this.value++;
		this.rolls++;
		return this.value;
	}
}

class Player {
	constructor(id, position, score) {
		this.id = id;
		this.position = position;
		this.score = score || 0;
	}

	move(die) {
		this.position += die.roll() + die.roll() + die.roll();
		this.position = ((this.position - 1) % 10) + 1;
		this.score += this.position;
	}

	dirac(val) {
		let position = ((this.position + val - 1) % 10) + 1;
		return new Player(this.id, position, this.score + position);
	}
}

class DiracGame {
	constructor(players, turn, copies) {
		this.players = players;
		this.turn = turn || 0;
		this.copies = copies || 1;
	}

	won() {
		return this.players[0].score > 20 || this.players[1].score > 20;
	}

	move() {
		let universes = [];
		let movingPlayer = (this.turn % 2) + 1;
		universes.push(new DiracGame(this.players.map(p => p.id === movingPlayer ? p.dirac(3) : p), this.turn + 1, this.copies));
		universes.push(new DiracGame(this.players.map(p => p.id === movingPlayer ? p.dirac(4) : p), this.turn + 1, 3 * this.copies));
		universes.push(new DiracGame(this.players.map(p => p.id === movingPlayer ? p.dirac(5) : p), this.turn + 1, 6 * this.copies));
		universes.push(new DiracGame(this.players.map(p => p.id === movingPlayer ? p.dirac(6) : p), this.turn + 1, 7 * this.copies));
		universes.push(new DiracGame(this.players.map(p => p.id === movingPlayer ? p.dirac(7) : p), this.turn + 1, 6 * this.copies));
		universes.push(new DiracGame(this.players.map(p => p.id === movingPlayer ? p.dirac(8) : p), this.turn + 1, 3 * this.copies));
		universes.push(new DiracGame(this.players.map(p => p.id === movingPlayer ? p.dirac(9) : p), this.turn + 1, this.copies));
		return universes;
	}
}

export class S21a extends Solver {
	solve(input) {
		let players = input.split('\n')
			.map(p => /^Player (\d+) starting position: (\d+)$/.exec(p).slice(1))
			.map(p => new Player(parseInt(p[0]), parseInt(p[1])));
		let die = new Die();
		let turn = 0;
		while (players[0].score < 1000 && players[1].score < 1000) {
			players[(turn % 2)].move(die);
			turn++;
		}
		let winner = (turn + 1) % 2;
		let loser = turn % 2;
		this.setState({ solution: `Player ${players[winner].id} wins!\nWinning score: ${players[winner].score}\nLosing score: ${players[loser].score}\nRolls: ${die.rolls}\nLosing score × rolls = ${die.rolls * players[loser].score}` });
	}
}

export class S21b extends Solver {
	move(games, wins, start) {
		let turns = 100000;
		while (games.length > 0 && turns-- > 0) {
			let moves = games.pop().move();
			moves.forEach(g => {
				if (g.players[0].score > 20) { wins[0] += g.copies; }
				if (g.players[1].score > 20) { wins[1] += g.copies; }
			});
			games = games.concat(moves.filter(g => !g.won()));
		}
		let elapsed = Date.now() - start;
		this.setState({ solution: `Number of universes: ${wins[0] + wins[1]}\nPlayer 1 wins in ${wins[0]} universes\nPlayer 2 wins in ${wins[1]} universes\nTime: ${elapsed / 1000} s` });
		if (games.length > 0)
			setTimeout(() => this.move(games, wins, start), 1);
	}

	solve(input) {
		let players = input.split('\n')
			.map(p => /^Player (\d+) starting position: (\d+)$/.exec(p).slice(1))
			.map(p => new Player(parseInt(p[0]), parseInt(p[1])));
		let games = [new DiracGame(players)];
		let wins = [0, 0];
		let start = Date.now();
		this.setState({ solution: `Number of universes: ${wins[0] + wins[1]}\nPlayer 1 wins in ${wins[0]} universes\nPlayer 2 wins in ${wins[1]} universes\nTime: 0 s` });
		setTimeout(() => this.move(games, wins, start), 1);
	}
}