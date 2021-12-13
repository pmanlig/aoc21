import Solver from './Solver';

export class S12a extends Solver {
	paths(connections, allowDupes) {
		let paths = 0;
		let active = [{ current: "start", visited: new Set(), dupes: 0 }];
		let extend = (a, c) => {
			let to = c[1];
			if (to === a.current) { to = c[0]; }
			else if (c[0] !== a.current) { return; }

			if (to === "start") { return; }
			else if (to === "end") { paths++; }
			else if (/[A-Z]+/.test(to)) {
				active.push({ current: to, visited: a.visited, dupes: a.dupes });
			} else {
				let dupes = a.dupes + (a.visited.has(to) ? 1 : 0);
				if (dupes < allowDupes) {
					active.push({ current: to, visited: new Set([...(a.visited), to]), dupes: dupes });
				}
			}
		}
		while (active.length > 0) {
			let a = active.pop();
			connections.forEach(c => extend(a, c));
		}
		return paths;
	}

	solve(input) {
		let test = "start-A\nstart-b\nA-c\nA-b\nb-d\nA-end\nb-end".split('\n').map(e => /^(\w+)-(\w+)$/.exec(e).slice(1));
		this.assert(this.paths(test, 1), 10);
		this.assert(this.paths(test, 2), 36);

		input = input.split('\n').map(e => /^(\w+)-(\w+)$/.exec(e).slice(1));
		let paths = this.paths(input, 1);
		let longerPaths = this.paths(input, 2);
		this.setState({
			solution: `Paths with no duplicates: ${paths}\nPaths with max one duplicate: ${longerPaths}`,
			data: undefined,
			scale: undefined,
			stylemap: undefined
		});
	}
}

export class S12b extends Solver {
}