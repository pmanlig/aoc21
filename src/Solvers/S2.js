// import React from 'react';
import Solver from './Solver';

export class S2a extends Solver {
	solve(input) {
		input = input.split('\n');
		let valid = 0, valid2 = 0;
		input.forEach(p => {
			let pwd = p.split(": ");
			let rule = pwd[0];
			pwd = pwd[1];
			rule = rule.split(' ');
			let req = rule[1][0];
			rule = rule[0].split('-');
			let min = parseInt(rule[0], 10);
			let max = parseInt(rule[1], 10);
			let occ = 0;
			for (let i = 0; i < pwd.length; i++) {
				if (pwd[i] === req) { occ++; }
			}
			if (min <= occ && occ <= max) { valid++; }
			if ((pwd[min - 1] === req || pwd[max - 1] === req) && (pwd[min - 1] !== pwd[max - 1])) { valid2++; }
		});
		this.setState({ solution: `Passwords: ${input.length}\nValid passwords(1): ${valid}\nValid passwords(2): ${valid2}` });
	}
}

export class S2b extends Solver {
}