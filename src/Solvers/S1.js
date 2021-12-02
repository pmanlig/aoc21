import Solver from './Solver';

export class S1a extends Solver {
	solve(input) {
		// input = input.split('\n');
		// input = input.split('\n').map(s => /^(\w+)$/.exec(s).splice(1));
		input = input.split('\n').map(s => parseInt(s));
		let count = 0, count2 = 0;
		for (let i = 1; i < input.length; i++) {
			if (input[i] > input[i - 1]) count++;
		}
		for (let j = 3; j < input.length; j++) {
			if (input[j - 3] < input[j]) count2++;
		}
		this.setState({ solution: `Increases: ${count}\nSliding window increases: ${count2}` });
	}
}

export class S1b extends Solver {
}