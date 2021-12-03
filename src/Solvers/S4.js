import Solver from './Solver';

export class S4a extends Solver {
	solve(input) {
		input = input.split('\n');
		// input = input.map(s => /^(\w+)$/.exec(s).splice(1));
		// input = input.map(s => parseInt(s));
		this.setState({ solution: `No solution yet` });
	}
}

export class S4b extends Solver {
}