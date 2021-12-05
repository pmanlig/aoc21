import Solver from './Solver';

class Map {
	data = [];

	direction(a, b) {
		return b < a ? -1 : (b === a ? 0 : 1);
	}

	mark(x, y) {
		if (this.data[x] === undefined) this.data[x] = [];
		if (this.data[x][y] === undefined) this.data[x][y] = 0;
		this.data[x][y]++;
	}

	setLine(x1, y1, x2, y2) {
		let len = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
		let dX = this.direction(x1, x2);
		let dY = this.direction(y1, y2);
		for (let i = 0; i <= len; i++) {
			this.mark(x1 + i * dX, y1 + i * dY);
		}
	}

	count() {
		let c = 0;
		for (let x = 0; x < this.data.length; x++) {
			if (this.data[x] !== undefined) {
				for (let y = 0; y < this.data[x].length; y++) {
					if (this.data[x][y] > 1) c++;
				}
			}
		}
		return c;
	}
}

export class S5a extends Solver {
	solve(input) {
		input = input.split('\n').map(r => /^(\d+),(\d+) -> (\d+),(\d+)/.exec(r).slice(1).map(n => parseInt(n)));
		let map = new Map();
		input.filter(l => l[0] === l[2] || l[1] === l[3]).forEach(l => map.setLine(l[0], l[1], l[2], l[3]));
		let count1 = map.count();
		input.filter(l => l[0] !== l[2] && l[1] !== l[3]).forEach(l => map.setLine(l[0], l[1], l[2], l[3]));
		let count2 = map.count();
		this.setState({ solution: `Count (without diagonals): ${count1}\nCount (with diagonals): ${count2}` });
	}
}

export class S5b extends Solver {
}