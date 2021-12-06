import Solver from './Solver';

export class S6a extends Solver {
	solve(input) {
		input = input.split(',').map(n => parseInt(n));
		// input = input.map(s => /^(\w+)$/.exec(s).splice(1));
		// input = input.map(s => parseInt(s));
		let fish = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		input.forEach(f => fish[f]++);
		let numFish80;
		for (let i = 0; i < 256; i++) {
			if (i===80) {
				numFish80 = fish.reduce((a, b) => a + b);
			}
			let breed = fish[0];
			for (let n = 0; n < 9; n++) {
				fish[n] = fish[n + 1];
			}
			fish[8] += breed;
			fish[6] += breed;
		}
		let numFish256 = fish.reduce((a, b) => a + b);
		this.setState({ solution: `Number of fish after 80 days: ${numFish80}\nNumber of fish after 256 days: ${numFish256}` });
	}
}

export class S6b extends Solver {
}