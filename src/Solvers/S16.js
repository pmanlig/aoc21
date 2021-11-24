//import React from 'react';
import Solver from './Solver';

class Rule {
	constructor(s) {
		this.name = s.match(/^([\w\s]+):/)[1];
		this.ranges = [];
		this.ranges = s.match(/([-\d]+)/g).map(r => r.split('-'));
	}

	valid(n) {
		for (let i = 0; i < this.ranges.length; i++) {
			if (n >= this.ranges[i][0] && n <= this.ranges[i][1]) { return true; }
		}
	}
}

export class S16a extends Solver {
	solve(input) {
		input = input.split('\n\n');
		let rules = input[0].split('\n').map(r => new Rule(r));
		let myTicket = input[1].match(/(\d+)/g).map(n => parseInt(n, 10)).map(n => { return { fields: rules.concat([]), val: n }; });
		let others = input[2].match(/([0-9,]+)/g).map(s => s.split(',').map(n => parseInt(n, 10)));
		let error = 0;
		others = others.filter(t => {
			let valid = true;
			t.forEach(v => {
				if (rules.filter(r => r.valid(v)).length === 0) {
					error += v;
					valid = false;
				}
			});
			return valid;
		});
		for (let i = 0; i < myTicket.length; i++) {
			myTicket[i].fields = myTicket[i].fields.filter(r => others.filter(o => !r.valid(o[i])).length === 0);
		}
		while (myTicket.filter(f => f.fields.length > 1).length > 0) {
			let figured = myTicket.filter(f => f.fields.length === 1).map(f => f.fields[0]);
			myTicket.forEach(f => {
				if (f.fields.length > 1) {
					f.fields = f.fields.filter(r => !figured.includes(r));
				}
			});
		}
		// console.log(myTicket.map(f => f.fields[0].name).join(','));
		let ticketVals = myTicket.filter(f => f.fields[0].name.startsWith("departure")).map(f => f.val);
		this.setState({ solution: `Error rate: ${error}\nMy ticket values: ${ticketVals.reduce((a, b) => a * b, 1)}` });
	}
}

export class S16b extends Solver {
}