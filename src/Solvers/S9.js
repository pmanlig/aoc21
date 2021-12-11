import Solver from './Solver';

export class S9a extends Solver {
	valueMap = {
		"0": "#000000",
		"1": "#1f1f1f",
		"2": "#2f2f2f",
		"3": "#4f4f4f",
		"4": "#5f5f5f",
		"5": "#6f6f6f",
		"6": "#8f8f8f",
		"7": "#9f9f9f",
		"8": "#bfbfbf",
		"9": "#cfcfcf"
	}

	isLow(x, y, map) {
		if (x > 0 && map[y][x] >= map[y][x - 1]) return false;
		if (y > 0 && map[y][x] >= map[y - 1][x]) return false;
		if (x < map[y].length - 1 && map[y][x] >= map[y][x + 1]) return false;
		if (y < map.length - 1 && map[y][x] >= map[y + 1][x]) return false;
		return true;
	}

	expandTo(coord, basin, map, expand) {
		if (coord.y < 0 || coord.y >= map.length) return;
		if (coord.x < 0 || coord.x >= map[coord.y].length) return;
		if (map[coord.y][coord.x] === 9) return;
		if (basin.filter(c => c.x === coord.x && c.y === coord.y).length > 0) return;
		basin.push(coord);
		expand.push(coord);
	}

	createBasin(coord, map) {
		let area = [coord];
		let expand = [coord];
		while (expand.length > 0) {
			let c = expand.pop();
			this.expandTo({ x: c.x + 1, y: c.y }, area, map, expand);
			this.expandTo({ x: c.x - 1, y: c.y }, area, map, expand);
			this.expandTo({ x: c.x, y: c.y + 1 }, area, map, expand);
			this.expandTo({ x: c.x, y: c.y - 1 }, area, map, expand);
		}
		return area;
	}

	solve(input) {
		// input = "2199943210\n3987894921\n9856789892\n8767896789\n9899965678";
		input = input.split('\n').map(l => l.split('').map(n => parseInt(n)));
		let risk = 0;
		let lows = [];
		for (let y = 0; y < input.length; y++) {
			for (let x = 0; x < input[y].length; x++) {
				if (this.isLow(x, y, input)) {
					risk += 1 + input[y][x];
					lows.push({ x: x, y: y });
				}
			}
		}
		lows = lows.map(l => this.createBasin(l, input));
		lows.sort((a, b) => b.length - a.length);
		let basinSizes = lows[0].length * lows[1].length * lows[2].length;
		this.setState({ solution: `Sum of risk levels: ${risk}\nBasins: ${basinSizes}`, data: input, scale: "5", stylemap: b => this.valueMap[b] });
	}
}

export class S9b extends Solver {
}