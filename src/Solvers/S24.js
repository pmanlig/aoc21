// import React from 'react';
import Solver from './Solver';

const white = 0;
const black = 1;

class HexCoord {
	constructor(e, ne, nw, w, se, sw) {
		this.e = e || 0;
		this.se = se || 0;
		this.sw = sw || 0;
		this.w = w || 0;
		this.ne = ne || 0;
		this.nw = nw || 0;
	}

	normalize() {
		return new HexCoord(this.e - this.w + this.se - this.nw, this.ne - this.sw - this.se + this.nw);
	}

	equal(x) {
		return this.e === x.e && this.ne === x.ne;
	}

	toString() {
		return `${this.e}e${this.ne}ne`;
	}

	static fromList(list) {
		let h = new HexCoord();
		list.forEach(d => h[d]++);
		return h.normalize();
	}
}

class Bounds {
	constructor() {
		this.e = 0;
		this.w = 0;
		this.ne = 0;
		this.sw = 0;
	}

	extend(e, ne) {
		if (this.e < e) { this.e = e; }
		if (this.ne < ne) { this.ne = ne; }
		if (this.w > e) { this.w = e; }
		if (this.sw > ne) { this.sw = ne; }
	}

	grow(n) {
		this.e += n;
		this.ne += n;
		this.w -= n;
		this.sw -= n;
	}
}

class TileMap {
	constructor() {
		this.data = [];
		this.bounds = new Bounds();
	}

	get(e, ne) {
		if (this.data[e] === undefined) { return white; }
		return this.data[e][ne] || white;
	}

	set(e, ne, val) {
		if (this.data[e] === undefined) {
			this.data[e] = [];
		}
		if (val === black) { this.bounds.extend(e, ne); }
		this.data[e][ne] = val;
	}

	flip(e, ne) {
		this.set(e, ne, this.get(e, ne) === white ? black : white);
	}

	count() {
		let c = 0;
		for (let e = this.bounds.w; e <= this.bounds.e; e++) {
			for (let ne = this.bounds.sw; ne <= this.bounds.ne; ne++) {
				if (this.get(e, ne) === black) { c++; }
			}
		}
		return c;
	}

	countAdjacent(e, ne) {
		let c = 0;
		if (this.get(e - 1, ne) === black) { c++; }
		if (this.get(e + 1, ne) === black) { c++; }
		if (this.get(e, ne - 1) === black) { c++; }
		if (this.get(e, ne + 1) === black) { c++; }
		if (this.get(e - 1, ne + 1) === black) { c++; }
		if (this.get(e + 1, ne - 1) === black) { c++; }
		return c;
	}

	day() {
		let d = new TileMap();
		for (let e = this.bounds.w - 1; e <= this.bounds.e + 1; e++) {
			d[e] = [];
			for (let ne = this.bounds.sw - 1; ne <= this.bounds.ne + 1; ne++) {
				let curr = this.get(e, ne);
				let adj = this.countAdjacent(e, ne);
				if (adj === 2 || (curr === black && adj === 1)) { d.set(e, ne, black); }
			}
		}
		return d;
	}
}

export class S24a extends Solver {
	solve(input) {
		// input = "sesenwnenenewseeswwswswwnenewsewsw\nneeenesenwnwwswnenewnwwsewnenwseswesw\nseswneswswsenwwnwse\nnwnwneseeswswnenewneswwnewseswneseene\nswweswneswnenwsewnwneneseenw\neesenwseswswnenwswnwnwsewwnwsene\nsewnenenenesenwsewnenwwwse\nwenwwweseeeweswwwnwwe\nwsweesenenewnwwnwsenewsenwwsesesenwne\nneeswseenwwswnwswswnw\nnenwswwsewswnenenewsenwsenwnesesenew\nenewnwewneswsewnwswenweswnenwsenwsw\nsweneswneswneneenwnewenewwneswswnese\nswwesenesewenwneswnwwneseswwne\nenesenwswwswneneswsenwnewswseenwsese\nwnwnesenesenenwwnenwsewesewsesesew\nnenewswnwewswnenesenwnesewesw\neneswnwswnwsenenwnwnwwseeswneewsenese\nneswnwewnwnwseenwseesewsenwsweewe\nwseweeenwnesenwwwswnew";
		input = input.split('\n');
		let coords = input.map(d => d.match(/(e|w|ne|nw|se|sw)/g)).map(l => HexCoord.fromList(l).normalize());
		// for (let i = 0; i < coords.length; i++) { if (coords[i].join('') !== input[i]) { console.log(`${coords[i].join('')}!==${input[i]}`) } } // test transformation is correct
		let map = new TileMap();
		coords.forEach(c => map.flip(c.e, c.ne));
		let initial = map.count();
		for (let i = 0; i < 100; i++) { map = map.day(); }
		this.setState({ input: input, coords: coords, initial: initial, count: map.count() });
	}

	customRender() {
		let { input, initial, count } = this.state;
		return <div>
			{input && <p>Input length: {input.length}</p>}
			<p>Initial black tiles: {initial}</p>
			<p>Eventual black tiles: {count}</p>
		</div>;
	}
}

export class S24b extends Solver {
}