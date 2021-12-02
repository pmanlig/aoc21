import Solver from './Solver';

export class S2a extends Solver {
	solve(input) {
		input = input.split('\n');
		input = input.map(s => /^(forward|down|up) (\d+)$/.exec(s).splice(1));
		input.forEach(i => {
			i[1] = parseInt(i[1]);
		});
		console.log(input);
		// input = input.map(s => parseInt(s));
		let horiz = 0, depth = 0;
		for (let i = 0; i < input.length; i++) {
			switch (input[i][0]) {
				case 'forward':
					horiz += input[i][1];
					break;
				case 'down':
					depth += input[i][1];
					break;
				case 'up':
					depth -= input[i][1];
					break;
				default:
					break;
			}
		}
		this.setState({ solution: `Target: ${horiz * depth}` });
	}
}

export class S2b extends Solver {
	solve(input) {
		input = input.split('\n');
		input = input.map(s => /^(forward|down|up) (\d+)$/.exec(s).splice(1));
		input.forEach(i => {
			i[1] = parseInt(i[1]);
		});
		console.log(input);
		// input = input.map(s => parseInt(s));
		let horiz = 0, depth = 0, aim = 0;
		for (let i = 0; i < input.length; i++) {
			switch (input[i][0]) {
				case 'forward':
					horiz += input[i][1];
					depth += aim * input[i][1];
					break;
				case 'down':
					aim += input[i][1];
					break;
				case 'up':
					aim -= input[i][1];
					break;
				default:
					break;
			}
		}
		this.setState({ solution: `Target: ${horiz * depth}` });
	}
}