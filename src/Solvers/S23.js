// import React from 'react';
import Solver from './Solver';

class Cups {
	constructor(txt, n) {
		this.cups = [];
		let labels = txt.split('').map(i => parseInt(i, 10));
		for (let i = 0; i < labels.length; i++) { this.cups[labels[i]] = labels[(i + 1) % labels.length]; }
		if (n !== undefined) {
			this.cups[n] = labels[0];
			this.cups[labels[labels.length - 1]] = labels.length + 1;
			for (let i = labels.length + 1; i < n; i++) {
				this.cups[i] = i + 1;
			}
		}
		this.current = labels[0];
		this.shuffles = 0;
	}

	shuffle() {
		let remove1 = this.cups[this.current];
		let remove2 = this.cups[remove1];
		let remove3 = this.cups[remove2];
		let insertAt = this.current === 1 ? this.cups.length - 1 : this.current - 1;
		while (insertAt === remove1 || insertAt === remove2 || insertAt === remove3) {
			insertAt = insertAt === 1 ? this.cups.length - 1 : insertAt - 1
		}
		this.cups[this.current] = this.cups[remove3];
		this.cups[remove3] = this.cups[insertAt];
		this.cups[insertAt] = remove1;
		this.current = this.cups[this.current];
		this.shuffles++;
	}

	key() {
		let next = this.cups[1], s = "";
		for (let i = 1; i < this.cups.length - 1; i++) {
			s += next;
			next = this.cups[next];
		}
		return s;
	}
}

export class S23a extends Solver {
	shuffle(state) {
		if (state.shuffles > 9999999) {
			let i = state.cups[1];
			this.setState({ result: i * state.cups[i] });
			return;
		}
		for (let i = 0; i < 100000; i++) { state.shuffle(); }
		this.setState({ part2: state });
		setTimeout(() => this.shuffle(state), 1);
	}

	solve(input) {
		// input = "389125467";
		let part1 = new Cups(input);
		for (let i = 0; i < 100; i++) { part1.shuffle(); }

		let part2 = new Cups(input, 1000000);

		this.setState({ part1: part1.key(), part2: part2 });
		setTimeout(() => this.shuffle(part2), 1);
	}

	customRender() {
		let { part1, part2, result } = this.state;
		if (part1 === undefined || part2 === undefined) { return <div></div>; }
		return <div>
			<p>Expected: 67384529</p>
			<p>Cup order: {part1}</p>
			<p>Shuffles: {part2.shuffles}</p>
			<p>Result: {result || "Calculating..."}</p>
		</div>;
	}
}

export class S23b extends Solver {
}