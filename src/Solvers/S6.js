//import React from 'react';
import Solver from './Solver';

export class S6a extends Solver {
	solve(input) {
		let groups = input.split('\n\n').map(g => {
			let a = {};
			let count = g.split('\n').length;
			g.replace(/\n/g, "").split("").forEach(r => { if (a[r] === undefined) a[r] = 1; else a[r]++; });
			a.all = Object.keys(a).filter(x => a[x] === count).length;
			a.any = Object.keys(a).length - 1;
			return a;
		});
		this.setState({ solution: `Groups: ${groups.length}\nTotal group answers: ${groups.reduce((a, b) => a + b.any, 0)}\nAll group count: ${groups.reduce((a, b) => a + b.all, 0)}` });
	}
}

export class S6b extends Solver {
}