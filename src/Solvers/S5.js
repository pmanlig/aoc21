//import React from 'react';
import Solver from './Solver';

export class S5a extends Solver {
	solve(input) {
		let sorted = input.replace(/F|L/g, "0").replace(/B|R/g, "1").split('\n').map(c => parseInt(c, 2)).sort((a, b) => a - b);
		let high = sorted[sorted.length - 1];
		let empty = sorted.find((id, i, a) => i < a.length - 1 && a[i + 1] !== id + 1) + 1;
		this.setState({ solution: `Lines: ${input.length}\nHigh: ${high}\nMy seat: ${empty}` });
	}
}

export class S5b extends Solver {
}