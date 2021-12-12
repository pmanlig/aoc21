import Solver from './Solver';

export class S11a extends Solver {
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

	flash(data) {
		let flashes = 0;
		for (let r = 0; r < data.length; r++) {
			for (let c = 0; c < data[r].length; c++) {
				if (data[r][c] > 9 && data[r][c] < 100) {
					flashes++;
					data[r][c] = 100;
					if (r > 0) {
						if (c > 0) data[r - 1][c - 1]++;
						data[r - 1][c]++;
						if (c < data[r - 1].length - 1) data[r - 1][c + 1]++;
					}
					if (c > 0) data[r][c - 1]++;
					if (c < data[r].length - 1) data[r][c + 1]++;
					if (r < data.length - 1) {
						if (c > 0) data[r + 1][c - 1]++;
						data[r + 1][c]++;
						if (c < data[r + 1].length - 1) data[r + 1][c + 1]++;
					}
				}
			}
		}
		return flashes;
	}

	step(data) {
		// Gather energy
		for (let r = 0; r < data.length; r++) {
			for (let c = 0; c < data[r].length; c++) {
				data[r][c]++;
			}
		}

		// Flash
		let flashes = 0, flash;
		do {
			flash = this.flash(data);
			flashes += flash;
		} while (flash > 0);

		// Reset
		for (let r = 0; r < data.length; r++) {
			for (let c = 0; c < data[r].length; c++) {
				if (data[r][c] > 9) data[r][c] = 0;
			}
		}

		return flashes;
	}

	solve(input) {
		let test = "5483143223\n2745854711\n5264556173\n6141336146\n6357385478\n4167524645\n2176841721\n6882881134\n4846848554\n5283751526";
		test = test.split('\n').map(l => l.split('').map(n => parseInt(n)));
		let flashes = 0;
		for (let i = 0; i < 100; i++) {
			if (i===10)	this.assert(flashes, 204);
			flashes += this.step(test);
		}
		this.assert(flashes,1656);
		input = input.split('\n').map(l => l.split('').map(n => parseInt(n)));
		flashes = 0;
		let stepFlash=0, step = 0;
		while (stepFlash < 100) {
			stepFlash = this.step(input);
			if (step++ < 100) flashes += stepFlash;
		}
		this.setState({ solution: `Flashes after 100 steps: ${flashes}\nAll flash in step: ${step}`, data: input, scale: "10", stylemap: b => this.valueMap[b] });
	}
}

export class S11b extends Solver {
}