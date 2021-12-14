import Solver from './Solver';

class Aggregator {
	constructor(rules) {
		rules.forEach(r => this[r[0] + r[1]] = 0);
	}

	add(key, mapper, other) {
		let m = mapper[key];
		this[m[0]] += other[key];
		this[m[1]] += other[key];
	}

	elemValue(template) {
		let elements = {};
		Object.keys(this).forEach(k => {
			k.split('').forEach(c => {
				if (elements[c] === undefined) elements[c] = 0;
				elements[c] += this[k];
			});
		});
		elements[template[0]]++;
		elements[template[template.length - 1]]++;
		Object.keys(elements).forEach(c => elements[c] /= 2);
		let elemCounts = Object.values(elements).sort((a, b) => b - a);
		return elemCounts[0] - elemCounts[elemCounts.length - 1];
	}
}

export class S14a extends Solver {
	expand(template, rules, count) {
		template = template.split('');
		rules = rules.split('\n').map(r => /^(\w)(\w) -> (\w)$/.exec(r).slice(1));
		let mapper = {};
		rules.forEach(r => {
			mapper[r[0] + r[1]] = [r[0] + r[2], r[2] + r[1]];
		});
		let sums = new Aggregator(rules);
		for (let i = 1; i < template.length; i++) { sums[template[i - 1] + template[i]]++; }
		while (count-- > 0) {
			let newSums = new Aggregator(rules);
			Object.keys(sums).forEach(k => newSums.add(k, mapper, sums));
			sums = newSums;
		}
		return sums.elemValue(template);
	}

	solve(input) {
		let test = "NNCB\n\nCH -> B\nHH -> N\nCB -> H\nNH -> C\nHB -> C\nHC -> B\nHN -> C\nNN -> C\nBH -> H\nNC -> B\nNB -> B\nBN -> B\nBB -> N\nBC -> B\nCC -> N\nCN -> C";
		test = test.split("\n\n");
		this.assert(this.expand(test[0], test[1], 10), 1588);
		this.assert(this.expand(test[0], test[1], 40), 2188189693529);

		input = input.split("\n\n");
		let elemVal10 = this.expand(input[0], input[1], 10);
		let elemVal40 = this.expand(input[0], input[1], 40);
		this.setState({ solution: `Result after 10 iterations: ${elemVal10}\nResult after 40 iterations: ${elemVal40}` });
	}
}

export class S14b extends Solver {
}