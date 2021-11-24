// import React from 'react';
import Solver from './Solver';

export class S18a extends Solver {
	parse(s, comp) {
		// console.log(`Parse: ${s}`);
		let p = s.match(/^([-\d]+)(.*)/);
		if (p) { return [parseInt(p[1], 10)].concat(this.parse(p[2], comp)); }
		p = s.match(/^ ([+*]) (.*)/);
		if (p) { return [p[1]].concat(this.parse(p[2], comp)); }
		if (s[0] === '(') {
			let c = 1, i = 0;
			while (c > 0) {
				i++;
				if (s[i] === '(') c++;
				if (s[i] === ')') c--;
			}
			return [this.eval(s.substring(1, i), comp)].concat(this.parse(s.substring(i + 1), comp));
		}
		return [];
	}

	calc(p) {
		// console.log(p);
		let r = p.shift();
		while (p.length > 0) {
			if (p[0] === '*') { r *= p[1]; }
			if (p[0] === '+') { r += p[1]; }
			p.shift();
			p.shift();
		}
		return r;
	}

	calc2(p) {
		// console.log(p);
		let r = p.pop();
		if (p.length === 0) { return r; }
		let op = p.pop();
		while (op === '+') {
			r += p.pop();
			if (p.length === 0) { return r; }
			op = p.pop();
		}
		if (p.length === 0) { return r; }
		return this.calc2(p) * r;
	}

	eval(s, c) {
		return c(this.parse(s, c));
	}

	solve(input) {
		// input = "1 + 2 * 3 + 4 * 5 + 6\n1 + (2 * 3) + (4 * (5 + 6))";
		// input = "2 * 3 + (4 * 5)";
		let sum = input.split('\n').map(s => this.eval(s, p => this.calc(p))).reduce((a, b) => a + b, 0);
		let sum2 = input.split('\n').map(s => this.eval(s, p => this.calc2(p))).reduce((a, b) => a + b, 0);
		this.setState({ solution: `Sum(1): ${sum}\nSum(2): ${sum2}` });
	}
}

export class S18b extends Solver {
}
