//import React from 'react';
import Solver from './Solver';

class Map3D {
	constructor() {
		this.data = [[[]]];
		this.minX = 0;
		this.maxX = 1;
		this.minY = 0;
		this.maxY = 1;
		this.minZ = 0;
		this.maxZ = 1;
		this.directions = [];
		for (let z = -1; z <= 1; z++) {
			for (let y = -1; y <= 1; y++) {
				for (let x = -1; x <= 1; x++) {
					if (z !== 0 || y !== 0 || x !== 0) { this.directions.push({ x: x, y: y, z: z }) }
				}
			}
		}
	}

	static fromString(s) {
		let m = new Map3D();
		m.data = [s.split('\n').map(r => r.split('').map(c => c === '#'))];
		m.minX = 0;
		m.maxX = m.data[0][0].length;
		m.minY = 0;
		m.maxY = m.data[0].length;
		m.minZ = 0;
		m.maxZ = 1;
		return m;
	}

	get(x, y, z) {
		if (this.data[z] === undefined) { this.data[z] = []; }
		if (this.data[z][y] === undefined) { this.data[z][y] = []; }
		return this.data[z][y][x] || false;
	}

	put(x, y, z, val) {
		if (this.data[z] === undefined) { this.data[z] = []; }
		if (this.data[z][y] === undefined) { this.data[z][y] = []; }
		this.data[z][y][x] = val;
	}

	cycle() {
		this.minX--;
		this.maxX++;
		this.minY--;
		this.maxY++;
		this.minZ--;
		this.maxZ++;
		let data = [];
		// console.log(`X: ${this.minX} - ${this.maxX}, Y: ${this.minY} - ${this.maxY}, Z: ${this.minZ} - ${this.maxZ}`);
		for (let z = this.minZ; z < this.maxZ; z++) {
			data[z] = [];
			for (let y = this.minY; y < this.maxY; y++) {
				data[z][y] = [];
				for (let x = this.minX; x < this.maxX; x++) {
					let current = this.get(x, y, z);
					let count = this.directions.filter(d => this.get(x + d.x, y + d.y, z + d.z)).length;
					data[z][y][x] = count === 3 || (current && count === 2);
				}
			}
		}
		// console.log(this.data);
		// console.log(data);
		this.data = data;
	}

	count() {
		let c = 0;
		for (let z = this.minZ; z < this.maxZ; z++) {
			for (let y = this.minY; y < this.maxY; y++) {
				for (let x = this.minX; x < this.maxX; x++) {
					if (this.get(x, y, z)) { c++; }
				}
			}
		}
		return c;
	}

	output() {
		let o = "";
		for (let z = this.minZ; z < this.maxZ; z++) {
			for (let y = this.minY; y < this.maxY; y++) {
				o += `${y}: `;
				for (let x = this.minX; x < this.maxX; x++) {
					o += this.get(x, y, z) ? '#' : '.';
				}
				o += "\n";
			}
			o += "\n\n";
		}
		return o;
	}
}

class Map4D {
	constructor() {
		this.data = [[[]]];
		this.minX = 0;
		this.maxX = 1;
		this.minY = 0;
		this.maxY = 1;
		this.minZ = 0;
		this.maxZ = 1;
		this.minW = 0;
		this.maxW = 1;
		this.directions = [];
		for (let w = -1; w <= 1; w++) {
			for (let z = -1; z <= 1; z++) {
				for (let y = -1; y <= 1; y++) {
					for (let x = -1; x <= 1; x++) {
						if (w !== 0 || z !== 0 || y !== 0 || x !== 0) { this.directions.push({ x: x, y: y, z: z, w: w }) }
					}
				}
			}
		}
	}

	static fromString(s) {
		let m = new Map4D();
		m.data = [[s.split('\n').map(r => r.split('').map(c => c === '#'))]];
		m.minX = 0;
		m.maxX = m.data[0][0][0].length;
		m.minY = 0;
		m.maxY = m.data[0][0].length;
		m.minZ = 0;
		m.maxZ = 1;
		m.minW = 0;
		m.maxW = 1;
		return m;
	}

	get(x, y, z, w) {
		if (this.data[w] === undefined) { this.data[w] = []; }
		if (this.data[w][z] === undefined) { this.data[w][z] = []; }
		if (this.data[w][z][y] === undefined) { this.data[w][z][y] = []; }
		return this.data[w][z][y][x] || false;
	}

	put(x, y, z, w, val) {
		if (this.data[w] === undefined) { this.data[w] = []; }
		if (this.data[w][z] === undefined) { this.data[w][z] = []; }
		if (this.data[w][z][y] === undefined) { this.data[w][z][y] = []; }
		this.data[w][z][y][x] = val;
	}

	cycle() {
		this.minX--;
		this.maxX++;
		this.minY--;
		this.maxY++;
		this.minZ--;
		this.maxZ++;
		this.minW--;
		this.maxW++;
		let data = [];
		// console.log(`X: ${this.minX} - ${this.maxX}, Y: ${this.minY} - ${this.maxY}, Z: ${this.minZ} - ${this.maxZ}`);
		for (let w = this.minW; w < this.maxW; w++) {
			data[w] = [];
			for (let z = this.minZ; z < this.maxZ; z++) {
				data[w][z] = [];
				for (let y = this.minY; y < this.maxY; y++) {
					data[w][z][y] = [];
					for (let x = this.minX; x < this.maxX; x++) {
						let current = this.get(x, y, z, w);
						let count = this.directions.filter(d => this.get(x + d.x, y + d.y, z + d.z, w + d.w)).length;
						data[w][z][y][x] = count === 3 || (current && count === 2);
					}
				}
			}
		}
		// console.log(this.data);
		// console.log(data);
		this.data = data;
	}

	count() {
		let c = 0;
		for (let w = this.minW; w < this.maxW; w++) {
			for (let z = this.minZ; z < this.maxZ; z++) {
				for (let y = this.minY; y < this.maxY; y++) {
					for (let x = this.minX; x < this.maxX; x++) {
						if (this.get(x, y, z, w)) { c++; }
					}
				}
			}
		}
		return c;
	}
}

export class S17a extends Solver {
	solve(input) {
		// input = ".#.\n..#\n###";
		let map3d = Map3D.fromString(input), map4d = Map4D.fromString(input);
		for (let i = 0; i < 6; i++) {
			map3d.cycle();
			map4d.cycle();
		}
		this.setState({ solution: `Active cubes (3D): ${map3d.count()}\nActive cubes (4D): ${map4d.count()}` });
	}
}

export class S17b extends Solver {
}