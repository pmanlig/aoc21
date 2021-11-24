import Solver from './Solver';

export class S1a extends Solver {
	solve(input) {
		let entries = input.split("\n").map(e => parseInt(e, 10));
		for (let i = 0; i < entries.length; i++) {
			for (let j = i + 1; j < entries.length; j++) {
				if (entries[i] + entries[j] === 2020) {
					this.setState({ solution: `${entries[i]} × ${entries[j]} = ${entries[i] * entries[j]}` });
					return;
				}
			}
		}
		this.setState({ solution: `Entries: ${entries.length}\nNo solution found` });
	}
}

export class S1b extends Solver {
	solve(input) {
		let entries = input.split("\n").map(e => parseInt(e, 10));
		for (let i = 0; i < entries.length; i++) {
			for (let j = i + 1; j < entries.length; j++) {
				for (let p = j + 1; p < entries.length; p++) {
					if (entries[i] + entries[j] + entries[p] === 2020) {
						this.setState({ solution: `${entries[i]} × ${entries[j]} × ${entries[p]} = ${entries[i] * entries[j] * entries[p]}` });
						return;
					}
				}
			}
		}
		this.setState({ solution: `Entries: ${entries.length}\nNo solution found` });
	}
}