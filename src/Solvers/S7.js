// import React from 'react';
import Solver from './Solver';

class Rule {
	constructor(line) {
		this.color = line.match(/^(\w+(?:\s\w+)?)/)[0];
		let c = line.match(/\d+\s\w+(?:\s\w+)?/g);
		if (null !== c) {
			this.contents = c.map(s => /(\d+)\s(\w+(?:\s\w+)?)/.exec(s)).map(a => {
				return {
					num: parseInt(a[1], 10),
					color: a[2]
				}
			});
		} else {
			this.contents = [];
		}
	}

	expand(map) {
		let ex = this.contents.map(c => c);
		let i = 0;
		while (i < ex.length) {
			let e = map[ex[i++].color].contents;
			e.forEach(c => {
				if (ex.filter(x => x.color === c.color).length === 0) { ex.push(c); }
			});
		}
		this.expandedContents = ex;
	}

	count(map) {
		let cnt = 0;
		this.contents.forEach(c => {
			cnt += c.num * (1 + map[c.color].count(map));
		});
		return cnt;
	}
}

export class S7a extends Solver {
	solve(input) {
		input = input.split('\n');
		let rules = input.map(r => new Rule(r)).filter(r => r.color !== undefined);
		let map = {};
		rules.forEach(r => { map[r.color] = r; });
		rules.forEach(r => r.expand(map));
		let shinyGold = rules.filter(x => x.expandedContents.filter(y => y.color === "shiny gold").length > 0).length;
		let shinyGoldContents = map["shiny gold"].count(map);
		this.setState({ solution: `Lines: ${input.length}\nRules: ${rules.length}\nShiny gold: ${shinyGold}\nShiny gold contents: ${shinyGoldContents}` });
	}
}

export class S7b extends Solver {
}