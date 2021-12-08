import Solver from './Solver';

export class S8a extends Solver {
	normalize(c) {
		return c.split('').sort().join('');
	}

	fiveSegmentNumber(n, one, four) {
		one = one.split('');
		if (n.includes(one[0]) && n.includes(one[1])) return 3;
		if (four.split('').filter(c => n.includes(c)).length === 3) return 5;
		return 2;
	}

	sixSegmentNumber(n, one, four) {
		one = one.split('');
		if (!n.includes(one[0]) || !n.includes(one[1])) return 6;
		if (four.split('').filter(c => n.includes(c)).length === 4) return 9;
		return 0;
	}

	decode(e) {
		let code = e.splice(10);
		e.sort((a, b) => a.length - b.length);
		let map = {};
		map[this.normalize(e[0])] = 1;
		map[this.normalize(e[1])] = 7;
		map[this.normalize(e[2])] = 4;
		// e[3] - e[5] = [2,3,5]
		map[this.normalize(e[3])] = this.fiveSegmentNumber(e[3], e[0], e[2]);
		map[this.normalize(e[4])] = this.fiveSegmentNumber(e[4], e[0], e[2]);
		map[this.normalize(e[5])] = this.fiveSegmentNumber(e[5], e[0], e[2]);
		// e[6] - e[8] = [0,6,9]
		map[this.normalize(e[6])] = this.sixSegmentNumber(e[6], e[0], e[2]);
		map[this.normalize(e[7])] = this.sixSegmentNumber(e[7], e[0], e[2]);
		map[this.normalize(e[8])] = this.sixSegmentNumber(e[8], e[0], e[2]);
		map[this.normalize(e[9])] = 8;

		return map[this.normalize(code[3])] + 10 * map[this.normalize(code[2])] + 100 * map[this.normalize(code[1])] + 1000 * map[this.normalize(code[0])];
	}

	solve(input) {
		input = input.split('\n');
		// input = input.map(n => parseInt(n));
		input = input.map(r => /^(\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) \| (\w+) (\w+) (\w+) (\w+)$/.exec(r).slice(1));
		let uniques = new Set([2, 3, 4, 7]);
		let output = input.map(e => e.slice(10));
		let count = output.map(e => e.map(d => uniques.has(d.length) ? 1 : 0).reduce((a, b) => a + b)).reduce((a, b) => a + b);
		let test = [];
		test.push(
			this.decode(["be", "cfbegad", "cbdgef", "fgaecd", "cgeb", "fdcge", "agebfd", "fecdb", "fabcd", "edb", "fdgacbe", "cefdb", "cefbgd", "gcbe"])
				=== 8394 ? "pass" : "fail",
			this.decode(["edbfga", "begcd", "cbg", "gc", "gcadebf", "fbgde", "acbgfd", "abcde", "gfcbed", "gfec", "fcgedb", "cgb", "dgebacf", "gc"])
				=== 9781 ? "pass" : "fail",
			this.decode(["acedgfb", "cdfbe", "gcdfa", "fbcad", "dab", "cefabd", "cdfgeb", "eafb", "cagedb", "ab", "cdfeb", "fcadb", "cdfeb", "cdbaf"])
				=== 5353 ? "pass" : "fail",
		);
		let sum = input.map(e => this.decode(e)).reduce((a, b) => a + b);
		this.setState({ solution: `Number of unique digits in output: ${count}\nSum of all entries: ${sum}\nTests: ${test.join(' ')}` });
	}
}

export class S8b extends Solver {
}