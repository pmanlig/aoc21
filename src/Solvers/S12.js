//import React from 'react';
import Solver from './Solver';

const dir = ['E', 'S', 'W', 'N'];

class Waypoint {
	constructor() {
		this.x = 10;
		this.y = -1;
	}

	left(n) {
		if (n === 0) { return; }
		let nx = this.y;
		let ny = -this.x;
		this.x = nx;
		this.y = ny;
		this.left(n - 1);
	}

	right(n) {
		if (n === 0) { return; }
		let nx = -this.y;
		let ny = this.x;
		this.x = nx;
		this.y = ny;
		this.right(n - 1);
	}

	move({ cmd, val }) {
		if (cmd === 'N') { this.y -= val; }
		if (cmd === 'S') { this.y += val; }
		if (cmd === 'E') { this.x += val; }
		if (cmd === 'W') { this.x -= val; }
		if (cmd === 'L') { this.left(val / 90); }
		if (cmd === 'R') { this.right(val / 90); }
	}
}

class Ship {
	constructor() {
		this.heading = 0;
		this.x = 0;
		this.y = 0;
		this.w = new Waypoint();
	}

	move({ cmd, val }) {
		if (cmd === 'N') { this.y -= val; }
		if (cmd === 'S') { this.y += val; }
		if (cmd === 'E') { this.x += val; }
		if (cmd === 'W') { this.x -= val; }
		if (cmd === 'F') { this.move({ cmd: dir[this.heading], val: val }); }
		if (cmd === 'L') { this.heading = (this.heading + dir.length - val / 90) % dir.length; }
		if (cmd === 'R') { this.heading = (this.heading + val / 90) % dir.length; }
	}

	waypoint({ cmd, val }) {
		if (cmd === 'F') {
			this.x += val * this.w.x;
			this.y += val * this.w.y;
		} else {
			this.w.move({ cmd: cmd, val: val });
		}
	}

	distance() {
		return Math.abs(this.x) + Math.abs(this.y);
	}
}

export class S12a extends Solver {
	solve(input) {
		input = input.split('\n').map(i => i.match(/^(\w)(\d+)/)).map(i => { return { cmd: i[1], val: parseInt(i[2], 10) }; });
		let s1 = new Ship(), s2 = new Ship();
		input.forEach(d => {
			s1.move(d);
			s2.waypoint(d);
		});
		this.setState({ solution: `Distance moved (1): ${s1.distance()}\nDistance moved (2): ${s2.distance()}` });
	}
}

export class S12b extends Solver {
}