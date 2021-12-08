import Solver from './Solver';

export class S7a extends Solver {
	solve(input) {
		// input = input.map(s => /^(\w+)$/.exec(s).splice(1));
		input = input.split(',').map(s => parseInt(s));
		input = input.sort((a, b) => a - b);
		let target = [], target2 = [];
		for (let t = input[0]; t <= input[input.length - 1]; t++) {
			target[t] = 0;
			target2[t] = 0;
			for (let i = 0; i < input.length; i++) {
				let dist = Math.abs(t - input[i])
				target[t] += dist;
				target2[t] += (dist + 1) * dist / 2;
			}
		}
		this.setState({ solution: `Min: ${input[0]}\nMax: ${input[input.length - 1]}\nMinimum fuel(a): ${Math.min(...target)}\nMinimum fuel(b): ${Math.min(...target2)}` });
	}
}

export class S7b extends Solver {
}