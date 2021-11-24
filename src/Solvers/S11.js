//import React from 'react';
import Solver from './Solver';

class Map {
	constructor(input) {
		this.data = input.split('\n').map(l => l.split(''));
		this.height = this.data.length;
		this.width = this.data[0].length;
		this.steps = 0;
	}

	tick(phase) {
		let limit = phase === 1 ? 3 : 4;
		let old = this.data;
		let newData = old.map(r => r.map(c => []));
		let changed = false;
		for (let r = 0; r < newData.length; r++) {
			for (let c = 0; c < newData[r].length; c++) {
				if (old[r][c] === '.') { newData[r][c] = '.'; }
				let count = this.count(r, c, '#', 2 === phase);
				if (old[r][c] === 'L') {
					if (count === 0) {
						newData[r][c] = '#';
						changed = true;
					} else {
						newData[r][c] = 'L';
					};
				}
				if (old[r][c] === '#') {
					if (count > limit) {
						newData[r][c] = 'L';
						changed = true;
					} else {
						newData[r][c] = '#';
					}
				}
			}
		}
		this.steps++;
		this.data = newData;
		return changed;
	}

	count(r, c, s, cont) {
		let count = 0;
		if (this.find(r, c, -1, -1, cont) === s) { count++; }
		if (this.find(r, c, -1, 0, cont) === s) { count++; }
		if (this.find(r, c, -1, 1, cont) === s) { count++; }
		if (this.find(r, c, 0, -1, cont) === s) { count++; }
		if (this.find(r, c, 0, 1, cont) === s) { count++; }
		if (this.find(r, c, 1, -1, cont) === s) { count++; }
		if (this.find(r, c, 1, 0, cont) === s) { count++; }
		if (this.find(r, c, 1, 1, cont) === s) { count++; }
		return count;
	}

	find(r, c, dr, dc, cont) {
		let maxRow = this.data.length;
		let maxCol = this.data[0].length;
		while ((r += dr, c += dc, (r >= 0 && c >= 0 && r < maxRow && c < maxCol))) {
			if (cont && this.data[r][c] === '.') { continue; }
			return this.data[r][c];
		}
	}

	countOccupied() {
		return this.data.map(r => r.filter(s => s === '#').join('')).join('').length;
	}

	output() {
		return this.data.map(r => r.join('')).join('\n');
	}
}

export class S11a extends Solver {
	solve(input) {
		// let test = new Map("L.LL.LL.LL\nLLLLLLL.LL\nL.L.L..L..\nLLLL.LL.LL\nL.LL.LL.LL\nL.LLLLL.LL\n..L.L.....\nLLLLLLLLLL\nL.LLLLLL.L\nL.LLLLL.LL");
		let map = new Map(input), map2 = new Map(input);
		while (map.tick(1)) { }
		while (map2.tick(2)) { }
		this.setState({ map: map, map2: map2 });
	}

	customRender() {
		let { map, map2 } = this.state;
		return <div>
			{map && <p>{`Map size: ${map.data[0].length}×${map.data.length}`}</p>}
			{map && <p>{`Map 1 steps: ${map.steps}, Seats occupied: ${map.countOccupied()}`}</p>}
			{map2 && <p>{`Map 2 steps: ${map2.steps}, Seats occupied: ${map2.countOccupied()}`}</p>}
			{/*map && <p style={{ fontFamily: "monospace" }}>{map.output()}</p>*/}
			{map2 && <p style={{ fontFamily: "monospace" }}>{map2.output()}</p>}
		</div>
	}
}

export class S11b extends Solver {
}