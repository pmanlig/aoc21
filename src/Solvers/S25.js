import Solver from './Solver';

class Map {
	constructor(data) {
		this.data = data;
		this.steps = 0;
	}

	move() {
		let d0 = this.data;
		let d1 = this.data.map(l => l.map(c => '.'));
		let moved = false;
		for (let r = 0; r < d0.length; r++) {
			for (let c = 0; c < d0[r].length; c++) {
				if (d0[r][c] === '>') {
					let n = (c + 1) % d0[r].length;
					if (d0[r][n] === '.') {
						d1[r][n] = '>';
						moved = true;
					} else { d1[r][c] = '>'; }
				}
			}
		}
		for (let r = 0; r < d0.length; r++) {
			for (let c = 0; c < d0[r].length; c++) {
				if (d0[r][c] === 'v') {
					let n = (r + 1) % d0.length;
					if (d0[n][c] !== 'v' && d1[n][c] === '.') {
						d1[n][c] = 'v';
						moved = true;
					} else { d1[r][c] = 'v'; }
				}
			}
		}
		this.data = d1;
		this.steps++;
		return moved;
	}

	toString() {
		return this.data.map(l => l.join('')).join('\n');
	}
}

export class S25a extends Solver {
	stylemap = {
		">": "#7FFF7F",
		"v": "#0F7F0F",
		".": "#000000"
	}

	solve(input) {
		// let o1 = "v...>>.vv> .vv>>.vv.. >>.>v>...v >>v>>.>.v. v>v.vv.v.. >.>>..v... .vv..>.>v. v.v..>>v.v ....v..v.>";
		// let t1 = "....>.>v.> v.v>.>v.v. >v>>..>v.. >>v>v>.>.v .>v.v...v. v>>.>vvv.. ..v...>>.. vv...>>vv. >.v.v..v.v";
		// let a1 = "....>.>v.> v.v>.>v.v. >v>>..>v.. >>v>v>.>.v .>v.v...v. v>>.>vvv.. ..v...>>.. .v...>>vv. v.v.v..v.v>";
		let test = new Map("v...>>.vv>\n.vv>>.vv..\n>>.>v>...v\n>>v>>.>.v.\nv>v.vv.v..\n>.>>..v...\n.vv..>.>v.\nv.v..>>v.v\n....v..v.>".split('\n').map(l => l.split('')));
		this.assert(test.move(), true);
		this.assert(test.toString(), "....>.>v.>\nv.v>.>v.v.\n>v>>..>v..\n>>v>v>.>.v\n.>v.v...v.\nv>>.>vvv..\n..v...>>..\nvv...>>vv.\n>.v.v..v.v")
		let lim = 100;
		while (lim-- > 0 && test.move());
		this.assert(test.steps, 58);
		let map = new Map(input.split('\n').map(l => l.split('')));
		lim = 1000;
		while (lim-- > 0 && map.move());
		this.setState({ solution: `Number of steps: ${map.steps}`, data: map.data, scale: 4, stylemap: c => this.stylemap[c] });
	}
}

export class S25b extends Solver {
}