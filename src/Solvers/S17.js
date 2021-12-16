import Solver from './Solver';

export class S17a extends Solver {
	solve(input) {
		input = input.split('\n');
		input = input.map(n => parseInt(n));
		input = input.map(e => /^(\w+)$/.exec(e).slice(1));
		this.setState({ solution: `No solution yet` });
	}
}

export class S17b extends Solver {
}