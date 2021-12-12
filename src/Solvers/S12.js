import Solver from './Solver';

export class S12a extends Solver {
	paths(connections) {
		let paths = 0;
		let active = [{ current: "start", visited: [] }];
		let extend = (a, c) => {
			let from = c[0], to = c[1];
			if (to === a.current) {
				from = c[1];
				to = c[0];
			}
			if (from === a.current) {
				if (to === "end") {
					paths++;
				} else if (!/[a-z]+/.test(to) || !a.visited.includes(to)) {
					active.push({ current: to, visited: a.visited.concat([from]) });
				}
			}
		}
		while (active.length > 0) {
			let a = active.shift();
			connections.forEach(c => extend(a, c));
		}
		return paths;
	}

	longerPaths(connections) {
		let paths = this.state.longerPaths || 0;
		let active = this.state.active || [{ current: "start", visited: [], dupes: 0 }];
		let extend = (a, c) => {
			let from = c[0], to = c[1];
			if (to === a.current) {
				from = c[1];
				to = c[0];
			}
			if (from === a.current) {
				if (to === "end") {
					paths++;
				} else {
					if (/[A-Z]+/.test(to)) {
						active.push({ current: to, visited: a.visited, dupes: a.dupes });
					} else if (to !== "start") {
						//*
						let visited = a.visited.concat([to]).sort(), dupes = 0;
						for (let i = 1; i < visited.length; i++) {
							if (visited[i] === visited[i - 1]) dupes++;
						}
						if (dupes < 2) {
							active.push({ current: to, visited: visited, dupes: dupes });
						}
						//*/
						/*
						let dupes = a.dupes, visited = a.visited;
						for (let i = 0; i < visited.length; i++) {
							if (visited[i] === to) {
								dupes++;
								break;
							}
						}
						if (dupes < 2) {
							active.push({ current: to, visited: visited.concat([to]), dupes: dupes });
						}
						//*/
						/*
						let dupes = a.dupes + (a.visited.includes(to) ? 1 : 0);
						if (dupes < 2) {
							active.push({ current: to, visited: a.visited.concat([to]), dupes: dupes });
						}
						//*/
					}
				}
			}
		}
		let iterations = 1000;
		while (active.length > 0 && iterations-- > 0) {
			let a = active.shift();
			connections.forEach(c => extend(a, c));
		}
		let end = Date.now();
		this.setState({ longerPaths: paths, active: active, elapsed: end - this.state.start });
		if (active.length > 0)
			setTimeout(() => this.longerPaths(connections), 1);
	}

	solve(input) {
		let start = Date.now();
		let test = "start-A\nstart-b\nA-c\nA-b\nb-d\nA-end\nb-end".split('\n').map(e => /^(\w+)-(\w+)$/.exec(e).slice(1));
		this.assert(this.paths(test), 10);

		input = input.split('\n').map(e => /^(\w+)-(\w+)$/.exec(e).slice(1));
		let paths = this.paths(input);
		this.setState({
			paths: paths,
			start: start,
			data: undefined,
			scale: undefined,
			stylemap: undefined
		});

		setTimeout(() => this.longerPaths(input), 1);
	}

	customRender() {
		return <div>
			<this.assertions />
			<p>Paths: {this.state.paths}</p>
			<p>Longer paths: {this.state.longerPaths}</p>
			<p>Calculations completed in: {(this.state.elapsed / 1000)} s</p>
		</div>;
	}
}

export class S12b extends Solver {
}