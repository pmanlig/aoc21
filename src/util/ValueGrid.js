export class ValueGrid {
	constructor(data) {
		this.data = data || [];
	}

	get(r, c) {
		if (this.data[r] === undefined) { this.data[r] = [] }
		return this.data[r][c];
	}

	put(r, c, val) {
		if (this.data[r] === undefined) { this.data[r] = [] }
		this.data[r][c] = val;
	}

	clockwise() { // clockwise
		let d = this.data.map(r => []);
		for (let r = this.data.length - 1; r >= 0; r--) {
			for (let c = 0; c < this.data[r].length; c++) {
				d[c].push(this.data[r][c]);
			}
		}
		this.data = d;
	}

	flipLateral() {
		this.data = this.data.map(r => r.reverse());
	}

	flipHorizontal() {
		this.data.reverse();
	}
}