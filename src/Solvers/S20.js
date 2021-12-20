import Solver from './Solver';

export class S20a extends Solver {
	grow(image, inf) {
		let n = image.map(l => [inf, ...l, inf]);
		n = [n[0].map(c => inf), ...n, n[0].map(c => inf)];
		return n;
	}

	extend(image) {
		for (let i = 0; i < image.length; i++) {
			image[i][0] = image[1][1];
			image[i][image[i].length - 1] = image[1][1];
		}
		image[0] = image[1].map(c => image[1][1]);
		image[image.length - 1] = image[1].map(c => image[1][1]);
		return image;
	}

	enhance(image, algorithm) {
		image = this.grow(image, image[0][0]);
		let e = image.map(l => l.map(c => c));
		for (let r = 1; r < e.length - 1; r++) {
			for (let c = 1; c < e[r].length - 1; c++) {
				let n = 4 * image[r - 1][c - 1] + 2 * image[r - 1][c] + image[r - 1][c + 1];
				n = 8 * n + 4 * image[r][c - 1] + 2 * image[r][c] + image[r][c + 1];
				n = 8 * n + 4 * image[r + 1][c - 1] + 2 * image[r + 1][c] + image[r + 1][c + 1];
				e[r][c] = algorithm[n];
			}
		}
		return this.extend(e);
	}

	solve(input) {
		let test = ["..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#", "#..#.\n#....\n##..#\n..#..\n..###"];
		test[0] = test[0].split('').map(c => c === '.' ? 0 : 1);
		test[1] = test[1].split('\n').map(l => l.split('').map(c => c === '.' ? 0 : 1));
		test[1] = this.grow(test[1], 0);
		test[1] = this.grow(test[1], 0);
		test[1] = this.enhance(test[1], test[0]);
		test[1] = this.enhance(test[1], test[0]);
		this.assert(test[1].flat().reduce((a, b) => a + b, 0), 35);

		input = input.split('\n\n');
		let algorithm = input[0].split('').map(c => c === '.' ? 0 : 1);
		let image = input[1].split('\n').map(l => l.split('').map(c => c === '.' ? 0 : 1));
		image = this.grow(image, 0);
		image = this.grow(image, 0);
		let lights2 = 0, lights50 = 0;
		for (let i = 0; i < 50; i++) {
			if (i === 2) { lights2 = image.flat().reduce((a, b) => a + b, 0); }
			image = this.enhance(image, algorithm);
		}
		lights50 = image.flat().reduce((a, b) => a + b, 0);
		this.setState({ solution: `Lit pixels after 2 steps: ${lights2}\nLit pixels after 50 steps: ${lights50}`, data: image, scale: "3" });
	}
}

export class S20b extends Solver {
}