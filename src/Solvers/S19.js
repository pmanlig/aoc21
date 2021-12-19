import Solver from './Solver';

const rotations = [
	[ // x=x
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]],
	[
		[1, 0, 0],
		[0, 0, -1],
		[0, 1, 0]],
	[
		[1, 0, 0],
		[0, -1, 0],
		[0, 0, -1]],
	[
		[1, 0, 0],
		[0, 0, 1],
		[0, -1, 0]],
	[ // x=-x
		[-1, 0, 0],
		[0, 1, 0],
		[0, 0, -1]],
	[
		[-1, 0, 0],
		[0, 0, -1],
		[0, -1, 0]],
	[
		[-1, 0, 0],
		[0, -1, 0],
		[0, 0, 1]],
	[
		[-1, 0, 0],
		[0, 0, 1],
		[0, 1, 0]],
	[ // x=y
		[0, -1, 0],
		[1, 0, 0],
		[0, 0, 1]],
	[
		[0, 1, 0],
		[1, 0, 0],
		[0, 0, -1]],
	[
		[0, 0, 1],
		[1, 0, 0],
		[0, 1, 0]],
	[
		[0, 0, -1],
		[1, 0, 0],
		[0, -1, 0]],
	[ // x=-y
		[0, 1, 0],
		[-1, 0, 0],
		[0, 0, 1]],
	[
		[0, -1, 0],
		[-1, 0, 0],
		[0, 0, -1]],
	[
		[0, 0, -1],
		[-1, 0, 0],
		[0, 1, 0]],
	[
		[0, 0, 1],
		[-1, 0, 0],
		[0, -1, 0]],
	[ // x=z
		[0, 0, -1],
		[0, 1, 0],
		[1, 0, 0]],
	[
		[0, 0, 1],
		[0, -1, 0],
		[1, 0, 0]],
	[
		[0, 1, 0],
		[0, 0, 1],
		[1, 0, 0]],
	[
		[0, -1, 0],
		[0, 0, -1],
		[1, 0, 0]],
	[ // x=-z
		[0, 0, 1],
		[0, 1, 0],
		[-1, 0, 0]],
	[
		[0, 0, -1],
		[0, -1, 0],
		[-1, 0, 0]],
	[
		[0, 1, 0],
		[0, 0, -1],
		[-1, 0, 0]],
	[
		[0, -1, 0],
		[0, 0, 1],
		[-1, 0, 0]],
];

class Coordinate {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	rotate(rot) {
		return new Coordinate(
			this.x * rot[0][0] + this.y * rot[1][0] + this.z * rot[2][0],
			this.x * rot[0][1] + this.y * rot[1][1] + this.z * rot[2][1],
			this.x * rot[0][2] + this.y * rot[1][2] + this.z * rot[2][2]
		);
	}

	translate(t) {
		return new Coordinate(this.x + t.x, this.y + t.y, this.z + t.z);
	}

	mul(f) {
		return new Coordinate(this.x * f, this.y * f, this.z * f);
	}

	equals(o) {
		return this.x === o.x && this.y === o.y && this.z === o.z;
	}

	length() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	toString() {
		return `x: ${this.x}, y: ${this.y}, z: ${this.z}\n`
	}

	static fromArray(arr) {
		return new Coordinate(arr[0], arr[1], arr[2]);
	}
}

class Scanner {
	constructor(beacons, position) {
		this.position = position || new Coordinate(0, 0, 0);
		this.beacons = beacons;
		this.otherScanners = [];
	}

	rotate(rot) {
		return new Scanner(this.beacons.map(b => b.rotate(rot)), this.position.rotate(rot));
	}

	translate(t) {
		return new Scanner(this.beacons.map(b => b.translate(t)), this.position.translate(t));
	}

	match(other) {
		return true;
	}

	merge(other) {
		for (let r = 0; r < rotations.length; r++) {
			let x = other.rotate(rotations[r]);
			for (let xb = 0; xb < x.beacons.length - 12; xb++) {
				for (let tb = 0; tb < this.beacons.length; tb++) {
					let t = x.beacons[xb].mul(-1).translate(this.beacons[tb]);
					let overlap = [], diff = [];
					x.beacons.forEach(b => {
						let trans = b.translate(t);
						if (this.beacons.some(a => trans.equals(a))) { overlap.push(trans); }
						else { diff.push(trans); }
					});
					if (overlap.length > 11) {
						this.beacons = this.beacons.concat(diff);
						this.otherScanners.push(other.position.translate(t));
						return true;
					}
				}
			}
		}
		return false;
	}

	maxDist() {
		if (this.otherScanners.length === 0) { return 0; }
		let max = Math.max(...this.otherScanners.map(s => s.length()));
		for (let a = 0; a < this.otherScanners.length; a++) {
			for (let b = a + 1; b < this.otherScanners.length; b++) {
				let d = this.otherScanners[a].translate(this.otherScanners[b].mul(-1)).length();
				if (d > max) { max = d; }
			}
		}
		return max;
	}

	static fromInput(input) {
		return new Scanner(input
			.map(c => /^([-|\d]+),([-|\d]+),([-|\d]+)$/.exec(c).slice(1).map(n => parseInt(n)))
			.map(a => Coordinate.fromArray(a)));
	}
}

export class S19a extends Solver {
	calculate(origo, input, start) {
		let t = input.pop();
		if (!origo.merge(t)) { input = [t].concat(input); }
		let maxDist = origo.maxDist();
		let elapsed = Date.now() - start;
		this.setState({ solution: `# beacons: ${origo.beacons.length}\nMaximum scanner distance: ${maxDist}\nScanners remaining: ${input.length}\nTime: ${elapsed / 1000} s` });
		if (input.length > 0) { setTimeout(() => this.calculate(origo, input, start), 1); }
	}

	solve(input) {
		this.assert(new Coordinate(5, 6, 7).equals(new Coordinate(5, 6, 7)), true);
		this.assert(new Coordinate(5, 6, 7).rotate(rotations[0]).equals(new Coordinate(5, 6, 7)), true);
		this.assert(new Coordinate(5, 6, 7).rotate(rotations[4]).equals(new Coordinate(-5, 6, -7)), true);
		this.assert(new Coordinate(5, 6, 7).rotate(rotations[8]).equals(new Coordinate(6, -5, 7)), true);
		this.assert(new Coordinate(5, 6, 7).mul(-1).equals(new Coordinate(-5, -6, -7)), true);
		let start = Date.now();
		input = input
			.split("--- scanner ")
			.filter(s => s !== "")
			.map(s => s.split('\n').slice(1).filter(l => l !== ""))
			.map(sc => Scanner.fromInput(sc));
		let origo = input.shift();
		this.setState({ solution: `# beacons: ${origo.beacons.length}\nMaximum scanner distance: ${0}\nScanners remaining: ${input.length}\nTime: ${0} s` });
		setTimeout(() => this.calculate(origo, input, start), 1);
	}
}

export class S19b extends Solver {
}