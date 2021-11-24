import React from 'react';
import Solver from './Solver';
import { ValueGrid, drawFilledRect, drawFilledCircle, drawLine, reverseArray } from '../util';

const left = 0;
const right = 1;
const top = 2;
const bottom = 3;
const reverse = 4;
const pixel_size = 4;

class Tile extends ValueGrid {
	constructor(id, data) {
		super(data);
		this.id = id;
		this.borders = [];
		this.calculateBorders();
	}

	static fromText(txt) {
		txt = txt.split('\n');
		let id = parseInt(txt.shift().match(/^Tile (\d+):/)[1], 10);
		let data = txt.map(r => r.split('').map(c => c === '.' ? '0' : '1'));
		return new Tile(id, data);
	}

	calculateBorders() {
		this.borders[top] = parseInt(this.data[0].join(''), 2);
		this.borders[reverse + top] = parseInt(reverseArray(this.data[0]).join(''), 2);
		this.borders[bottom] = parseInt(this.data[9].join(''), 2);
		this.borders[reverse + bottom] = parseInt(reverseArray(this.data[9]).join(''), 2);
		let l = [];
		let r = [];
		this.data.forEach(line => {
			l.push(line[0]);
			r.push(line[9]);
		});
		this.borders[left] = parseInt(l.join(''), 2);
		this.borders[reverse + left] = parseInt(reverseArray(l).join(''), 2);
		this.borders[right] = parseInt(r.join(''), 2);
		this.borders[reverse + right] = parseInt(reverseArray(r).join(''), 2);
	}

	orient(dir) {
		if (dir === right) {
			this.flipLateral();
		}
		if (dir === top) {
			this.clockwise();
			this.flipLateral();
		}
		if (dir === bottom) {
			this.flipLateral();
			this.clockwise();
			this.flipLateral();
		}
		this.calculateBorders();
	}

	matchLeft(x) {
		if (this.borders[right] === x) { return true; }
		if (this.borders[reverse + right] === x) {
			this.flipHorizontal();
			this.calculateBorders();
			return true;
		}
		if (this.borders[left] === x) {
			this.flipLateral();
			this.calculateBorders();
			return true;
		}
		if (this.borders[reverse + left] === x) {
			this.flipHorizontal();
			this.flipLateral();
			this.calculateBorders();
			return true;
		}
		if (this.borders[top] === x) {
			this.clockwise();
			this.calculateBorders();
			return true;
		}
		if (this.borders[reverse + top] === x) {
			this.clockwise();
			this.flipHorizontal();
			this.calculateBorders();
			return true;
		}
		if (this.borders[bottom] === x) {
			this.clockwise();
			this.flipLateral();
			this.calculateBorders();
			return true;
		}
		if (this.borders[reverse + bottom] === x) {
			this.clockwise();
			this.flipHorizontal();
			this.flipLateral();
			this.calculateBorders();
			return true;
		}
		return false;
	}

	match(x, dir) {
		if (this.matchLeft(x)) {
			this.orient(dir);
			return true;
		}
		return false;
	}
}

class Map extends ValueGrid {
	constructor(data) {
		super(data);
		let monster = [
			"                  # ",
			"#    ##    ##    ###",
			" #  #  #  #  #  #   "
		];
		this.monster = monster.map(l => l.split(''));
	}

	static fromTiles(tiles) {
		let data = [];
		tiles.forEach(r => {
			let rows = [];
			r.forEach(t => {
				let d = t.data.slice(1, t.data.length - 1);
				for (let i = 0; i < d.length; i++) {
					if (rows[i] === undefined) { rows[i] = ""; }
					rows[i] = rows[i] + d[i].slice(1, d[i].length - 1).map(c => c === '1' ? '#' : '.').join('');
				}
			});
			data = data.concat(rows);
		});
		return new Map(data.map(l => l.split('')));
	}

	isMonster(r, c) {
		for (let mr = 0; mr < this.monster.length; mr++) {
			for (let mc = 0; mc < this.monster[mr].length; mc++) {
				if (this.monster[mr][mc] === '#' && this.data[r + mr][c + mc] !== '#') { return false; }
			}
		}
		return true;
	}

	countMonsters() {
		let m = 0;
		for (let r = 0; r < (this.data.length - this.monster.length + 1); r++) {
			for (let c = 0; c < (this.data[r].length - this.monster[0].length + 1); c++) {
				if (this.isMonster(r, c)) { m++; }
			}
		}
		return m;
	}

	replaceMonster(r, c) {
		for (let mr = 0; mr < this.monster.length; mr++) {
			for (let mc = 0; mc < this.monster[mr].length; mc++) {
				if (this.monster[mr][mc] === '#') { this.data[r + mr][c + mc] = '+'; }
			}
		}
	}

	replaceMonsters() {
		for (let r = 0; r < (this.data.length - this.monster.length + 1); r++) {
			for (let c = 0; c < (this.data[r].length - this.monster[0].length + 1); c++) {
				if (this.isMonster(r, c)) { this.replaceMonster(r, c); }
			}
		}
	}

	countRough() {
		return this.data.map(l => l.filter(c => c === '#').length).reduce((a, b) => a + b, 0);
	}
}

export class S20a extends Solver {
	constructor(props) {
		super(props);
		this.canvas = React.createRef();
	}

	matchRow(tile, unmatched) {
		let row = [tile];
		let match = unmatched.filter(t => t.match(tile.borders[left], left));
		while (match.length === 1) {
			let x = match[0];
			row.unshift(x);
			unmatched = unmatched.filter(t => t.id !== x.id);
			match = unmatched.filter(t => t.match(x.borders[left], left));
		}
		match = unmatched.filter(t => t.match(tile.borders[right], right));
		while (match.length === 1) {
			let x = match[0];
			row.push(x);
			unmatched = unmatched.filter(t => t.id !== x.id);
			match = unmatched.filter(t => t.match(x.borders[right], right));
		}
		return row;
	}

	matchColumn(tile, unmatched) {
		let col = [tile];
		let match = unmatched.filter(t => t.match(tile.borders[top], top));
		while (match.length === 1) {
			let x = match[0];
			col.unshift(x);
			unmatched = unmatched.filter(t => t.id !== x.id);
			match = unmatched.filter(t => t.match(x.borders[top], top));
		}
		match = unmatched.filter(t => t.match(tile.borders[bottom], bottom));
		while (match.length === 1) {
			let x = match[0];
			col.push(x);
			unmatched = unmatched.filter(t => t.id !== x.id);
			match = unmatched.filter(t => t.match(x.borders[bottom], bottom));
		}
		return col;
	}

	drawImage(map) {
		const ctx = this.canvas.current.getContext("2d");
		drawFilledRect(ctx, 0, 0, 96 * pixel_size, 96 * pixel_size, "#CFCFFF");
		for (let r = 0; r < map.data.length; r++) {
			for (let c = 0; c < map.data[r].length; c++) {
				if (map.data[r][c] === '+') {
					drawFilledCircle(ctx, c * pixel_size, r * pixel_size, pixel_size / 2, "#1F9F1F");
				}
				if (map.data[r][c] === '#') {
					drawLine(ctx, c * pixel_size, (r + 0.5) * pixel_size, (c + 0.5) * pixel_size, r * pixel_size, "#7F7FCF", 1)
					drawLine(ctx, (c + 1) * pixel_size, (r + 0.5) * pixel_size, (c + 0.5) * pixel_size, r * pixel_size, "#7F7FCF", 1)
				}
			}
		}
	}

	findMonsters(map) {
		let m = Map.fromTiles(map);
		let c = m.countMonsters();
		for (let i = 0; i < 4; i++) {
			if (0 === c) {
				m.clockwise();
				c = m.countMonsters();
			}
		}
		if (0 === c) {
			// m.flipHorizontal(); // ToDo: generalize
			c = m.countMonsters();
		}
		if (0 === c) {
			m.flipLateral();
			c = m.countMonsters();
		}
		m.replaceMonsters();
		this.setState({ map: m, monsters: c, rough: m.countRough() });
		setTimeout(() => this.drawImage(m), 1);
	}

	match(matched, unmatched) {
		let start = unmatched[0];
		unmatched = unmatched.filter(t => t.id !== start.id);
		let col = this.matchColumn(start, unmatched);
		matched = matched.concat(col);
		col.forEach(m => {
			unmatched = unmatched.filter(t => t.id !== m.id);
		});
		let map = col.map(r => {
			let row = this.matchRow(r, unmatched);
			row.forEach(m => {
				unmatched = unmatched.filter(t => t.id !== m.id);
				if (!matched.includes(m)) { matched.push(m) }
			});
			return row;
		});
		this.setState({ matched: matched, unmatched: unmatched, map: Map.fromTiles(map), answer: map[0][0].id * map[0][11].id * map[11][0].id * map[11][11].id });
		setTimeout(() => this.findMonsters(map), 1);
	}

	solve(input) {
		let tiles = input.split("\n\n").map(t => Tile.fromText(t));
		let matched = [];
		this.setState({ matched: matched, unmatched: tiles });
		setTimeout(() => this.match(matched, tiles), 1);
	}

	customRender() {
		let { matched, unmatched, answer, monsters, rough } = this.state;
		if (matched === undefined || unmatched === undefined) { return <div><canvas id="image" ref={this.canvas} width={96 * pixel_size} height={96 * pixel_size} /></div>; }
		return <div>
			<p>{`Tiles: ${matched.length + unmatched.length}`}</p>
			<p>{`Matched tiles: ${matched.length}`}</p>
			<p>{`Unmatched tiles: ${unmatched.length}`}</p>
			<p>Answer: {answer}</p>
			<p>Monsters: {monsters}</p>
			<p>Rough: {rough}</p>
			<p>&nbsp;</p>
			<canvas id="image" ref={this.canvas} width={96 * pixel_size} height={96 * pixel_size} />
		</div>;
	}
}

export class S20b extends Solver {
}