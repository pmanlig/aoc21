import Solver from './Solver';

const valueMap = {
	"0": "#000000",
	"1": "#1f1f1f",
	"2": "#2f2f2f",
	"3": "#4f4f4f",
	"4": "#5f5f5f",
	"5": "#6f6f6f",
	"6": "#8f8f8f",
	"7": "#9f9f9f",
	"8": "#bfbfbf",
	"9": "#cfcfcf",
	"10": "#ff3f3f"
}

class Path {
	constructor(x, y, risk, score, path) {
		this.x = x;
		this.y = y;
		this.risk = risk;
		this.score = score;
		this.path = path;
	}
}

class S15 extends Solver {
	findPath(map) {
		let maxRisk = 20 * map.length;
		let risks = map.map(l => l.map(c => maxRisk));
		let goal = { x: map[map.length - 1].length - 1, y: map.length - 1 }
		let active = [new Path(0, 0, 0, 2 * map.length, null)];
		let best = null;
		let add = (prev, x, y) => {
			let r = prev.risk + map[y][x];
			if (risks[y][x] <= r) { return; }
			else risks[y][x] = r;
			let s = r + 2 * map.length - x - y;
			if (best !== null && best.risk < s) { return; }
			let n = new Path(x, y, r, s, prev);
			if (x === goal.x && y === goal.y) {
				best = n;
				active = active.filter(p => p.score < r);
			} else {
				active.push(n);
			}
		}
		while (active.length > 0) {
			let p = active.pop();
			if (p.x > 0) add(p, p.x - 1, p.y);
			if (p.y > 0) add(p, p.x, p.y - 1);
			if (p.x < map[p.y].length - 1) add(p, p.x + 1, p.y);
			if (p.y < map.length - 1) add(p, p.x, p.y + 1);
			active.sort((a, b) => b.score - a.score);
		}
		return best;
	}

	expandMap(map) {
		let size = { x: map[0].length, y: map.length };
		let exp = [];
		for (let y = 0; y < 5 * map.length; y++) { exp[y] = []; }
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				for (let dy = 0; dy < 5; dy++) {
					for (let dx = 0; dx < 5; dx++) {
						exp[y + dy * size.y][x + dx * size.x] = ((map[y][x] + dx + dy - 1) % 9) + 1;
					}
				}
			}
		}
		return exp;
	}

	markPath(path, map) {
		while (path !== null) {
			map[path.y][path.x] = 10;
			path = path.path;
		}
	}
}

export class S15a extends S15 {
	solve(input) {
		let test = "1163751742\n1381373672\n2136511328\n3694931569\n7463417111\n1319128137\n1359912421\n3125421639\n1293138521\n2311944581";
		test = test.split('\n').map(l => l.split('').map(n => parseInt(n)));
		this.assert(this.findPath(test).risk, 40);

		input = input.split('\n').map(l => l.split('').map(n => parseInt(n)));
		let path = this.findPath(input);
		let risk = path.risk;
		this.markPath(path, input);
		this.setState({ solution: `Lowest risk: ${risk}`, data: input, scale: "5", stylemap: v => valueMap[v] });
	}
}

export class S15b extends S15 {
	calcExpanded(input) {
		let path = this.findPath(input);
		let risk = path.risk;
		this.markPath(path, input);
		this.setState({ solution: `Lowest risk: ${risk}`, data: input, stylemap: v => valueMap[v] });
	}

	solve(input) {
		let test = "1163751742\n1381373672\n2136511328\n3694931569\n7463417111\n1319128137\n1359912421\n3125421639\n1293138521\n2311944581";
		test = test.split('\n').map(l => l.split('').map(n => parseInt(n)));
		this.assert(this.findPath(this.expandMap(test)).risk, 315);

		input = input.split('\n').map(l => l.split('').map(n => parseInt(n)));
		input = this.expandMap(input);
		this.setState({ solution: `Lowest risk on expanded map: Calculating...`, data: input, stylemap: v => valueMap[v] });
		setTimeout(() => this.calcExpanded(input), 1);
	}
}