import Solver from './Solver';

let EMPTY_ROOM = 4;

class Cave {
	static init = { ".": 4, "A": 0, "B": 1, "C": 2, "D": 3 }
	static energy = [1, 10, 100, 1000];
	static room2corr = [
		[3, 2, 2, 4, 6, 8, 9],
		[5, 4, 2, 2, 4, 6, 7],
		[7, 6, 4, 2, 2, 4, 5],
		[9, 8, 6, 4, 2, 2, 3]
	];
	static room2room = [
		[0, 4, 6, 8],
		[4, 0, 4, 6],
		[6, 4, 0, 4],
		[8, 6, 4, 0],
	];

	constructor(rooms, corridor, energy) {
		this.rooms = rooms || [0, 0, 0, 0, 0, 0, 0, 0];
		this.corridor = corridor || [EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM];
		this.energy = energy || 0;
	}

	moveRoom2Corridor(r, c) {
		let n = new Cave([...this.rooms], [...this.corridor], this.energy);
		let d = Cave.room2corr[r % 4][c] + Math.floor(r / 4);
		n.energy += d * Cave.energy[n.rooms[r]];
		n.corridor[c] = n.rooms[r];
		n.rooms[r] = EMPTY_ROOM;
		return n;
	}

	room2Corridor(r) {
		let n = [];
		let c = r % 4 + 1;
		while (c > -1 && this.corridor[c] === EMPTY_ROOM) {
			n.push(this.moveRoom2Corridor(r, c));
			c--;
		}
		c = r % 4 + 2;
		while (c < 7 && this.corridor[c] === EMPTY_ROOM) {
			n.push(this.moveRoom2Corridor(r, c));
			c++;
		}
		return n;
	}

	moveCorridor2Room(c, r) {
		let n = new Cave([...this.rooms], [...this.corridor], this.energy);
		n.energy += (Cave.room2corr[r % 4][c] + Math.floor(r / 4)) * Cave.energy[n.corridor[c]];
		n.rooms[r] = n.corridor[c];
		n.corridor[c] = EMPTY_ROOM;
		return n;
	}

	corridor2Room(c, r) {
		for (let x = c; x++ < (r + 1);) { if (this.corridor[x] !== EMPTY_ROOM) { return []; } }
		for (let x = c; x-- > (r + 2);) { if (this.corridor[x] !== EMPTY_ROOM) { return []; } }
		while (r < this.rooms.length && this.rooms[r] === EMPTY_ROOM) { r += 4; }
		if (r < this.rooms.length && this.rooms[r] !== this.corridor[c]) { return []; }
		if (r < 4) { return []; }
		r -= 4;
		return [this.moveCorridor2Room(c, r)];
	}

	moves() {
		let n = [];
		for (let r = 0; r < 4; r++) {
			// Obvious moves. Fill up empty room! Only pick one move, because order doesn't matter here.
			let d = r + 4 * (this.rooms.length / 4 - 1);
			while (d > 3 && this.rooms[d] === r) { d -= 4; }
			if (this.rooms[d] === EMPTY_ROOM) {
				let c = r + 1;
				while (c > 0 && this.corridor[c] === EMPTY_ROOM) { c--; }
				if (this.corridor[c] === r) { return [this.moveCorridor2Room(c, d)]; }
				c = r + 2;
				while (c < (this.corridor.length - 1) && this.corridor[c] === EMPTY_ROOM) { c++; }
				if (this.corridor[c] === r) { return [this.moveCorridor2Room(c, d)]; }
			}

			// Move from room to corridor
			for (let d = r; d < this.rooms.length; d += 4) {
				if (this.rooms[d] !== EMPTY_ROOM) {
					for (let x = d; x < this.rooms.length; x += 4) {
						if (this.rooms[x] !== r) {
							n = n.concat(this.room2Corridor(d));
							break;
						}
					}
					break;
				}
			}
		}
		return n;
	}

	remaining() {
		if (this.rem === undefined) {
			this.rem = 0;
			for (let c = 0; c < this.corridor.length; c++) {
				if (this.corridor[c] !== EMPTY_ROOM) {
					let p = this.corridor[c];
					this.rem += Cave.room2corr[p][c] * Cave.energy[p];
				}
			}
			for (let r = 0; r < this.rooms.length; r++) {
				let p = this.rooms[r];
				if (p !== (r % 4)) {
					if (p !== EMPTY_ROOM) {
						this.rem += (Cave.room2room[r % 4][p] + Math.floor(r / 4)) * Cave.energy[p];
					}
					if (r > 3) { this.rem += Cave.energy[r % 4] * Math.floor(r / 4); }
				}
			}
		}
		return this.rem;
	}

	score() {
		return this.energy + this.remaining();
	}

	complete() {
		for (let r = 0; r < this.rooms.length; r++) { if (this.rooms[r] !== (r % 4)) { return false; } }
		return true;
	}

	hash() {
		if (this._hash === undefined) {
			this._hash = this.rooms.reduce((a, b) => 5 * a + b, 0);
			this._hash = this.corridor.reduce((a, b) => 5 * a + b, this._hash);
		}
		return this._hash;
	}

	static fromArray(a) {
		return new Cave(a.map(b => Cave.init[b]));
	}
}

export class S23a extends Solver {
	search(active, second, start, pt1, seen) {
		seen = seen || new Set();
		let m;
		for (let i = 0; i < 2500; i++) {
			m = active.pop();
			if (m.complete()) {
				if (pt1 === 0) {
					pt1 = m.energy;
					seen = new Set();
					active = second;
					second = null;
					this.setState({ solution: `Lowest energy (simple): ${pt1}\nLowest energy (advanced): 0\nRemaining: 0\nTime: ${(Date.now() - start) / 1000} s` });
					continue;
				} else {
					this.setState({ solution: `Lowest energy (simple): ${pt1}\nLowest energy (advanced): ${m.energy}\nRemaining: 0\nTime: ${(Date.now() - start) / 1000} s` });
					return;
				}
			}
			if (!seen.has(m.hash())) {
				seen.add(m.hash());
				active = active.concat(m.moves()).sort((a, b) => b.score() - a.score());
			}
		}
		this.setState({ solution: `Lowest energy (simple): ${pt1}\nLowest energy (advanced): 0\nRemaining: ${m.remaining()}\nTime: ${(Date.now() - start) / 1000} s` });
		setTimeout(() => this.search(active, second, start, pt1, seen), 1);
	}

	solve(input) {
		input = input.match(/([A-D])/g);
		this.setState({ solution: `Time: 0 s\nLowest energy (simple): 0\nLowest energy (advanced): 0\nRemaining: 0\nTime: 0 s` });
		let active = [Cave.fromArray(input)];
		input.splice(4, 0, "D", "C", "B", "A", "D", "B", "A", "C");
		setTimeout(() => this.search(active, [Cave.fromArray(input)], Date.now(), 0), 1);
	}
}

export class S23b extends Solver {
}