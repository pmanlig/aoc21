//import React from 'react';
import Solver from './Solver';

export class S13a extends Solver {
	passConstraints(t, tc) {
		let m = 0;
		for (let i = 0; i < tc.length; i++) {
			let id = tc[i].id;
			let bm = (id - ((t + tc[i].offset) % id)) % id;
			// console.log(`t: ${t}, id: ${id}, offset: ${tc[i].offset}, bm: ${bm}`);
			if (bm > m) { m = bm; }
		}
		return m;
	}

	find2(pt, constraints, mul) {
		// console.log(`pt: ${pt}, mul: ${mul}`);
		// console.log(constraints);
		if (constraints.length === 0) { return pt; }
		let n = constraints.shift();
		while ((pt + n.offset) % n.id > 0) { pt += mul }
		let i = 1;
		while (i < n.id && ((mul * i) % n.id) > 0) { i++; }
		return this.find2(pt, constraints, mul * i);
	}

	find(constraints) {
		let f = constraints.shift();
		let pt = f.id - f.offset;
		return this.find2(pt, constraints, f.id);
	}

	solve(input) {
		// input = "939\n7,13,x,x,59,x,31,19";
		input = input.split('\n');
		let time = parseInt(input[0], 10);
		let buses = input[1].split(',');
		let times = buses.filter(b => b !== 'x').map(n => parseInt(n, 10)).map(t => {
			let e = t * Math.floor(time / t);
			while (e < time) { e += t; }
			return { id: t, earliest: e };
		}).sort((a, b) => a.earliest - b.earliest);
		let earliest = times[0].id * (times[0].earliest - time);
		let timeConstraints = [];
		for (let i = 0; i < buses.length; i++) {
			if (buses[i] !== 'x') {
				timeConstraints.push({ id: parseInt(buses[i], 10), offset: i });
			}
		}
		timeConstraints = timeConstraints.sort((a, b) => b.id - a.id);
		let perfectTime = this.find(timeConstraints);
		this.setState({ earliest: earliest, solution: `Answer: ${earliest} \nPerfect time: ${perfectTime}` });
		// setTimeout(() => this.find(0, timeConstraints), 1);
	}
}

export class S13b extends Solver {
}