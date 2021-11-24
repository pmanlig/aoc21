// import React from 'react';
import Solver from './Solver';

class Rule {
	constructor(txt) {
		let m = txt.match(/"(\w)"/);
		if (m) {
			this.txt = m[1];
			return;
		} else {
			this.rule = txt.split(" | ").map(p => p.split(' ').map(n => parseInt(n, 10)));
		}
	}

	connect(rules) {
		if (this.rule) { this.rule = this.rule.map(l => l.map(r => rules[r])); }
	}

	valid(s, n) {
		if (this.txt !== undefined) { return s[n] === this.txt ? this.txt.length : 0; }
		for (let i = 0; i < this.rule.length; i++) {
			let match = true, acc = 0;
			for (let j = 0; j < this.rule[i].length; j++) {
				let m = this.rule[i][j].valid(s, n + acc);
				if (m === 0) {
					match = false;
				} else {
					acc += m;
				}
			}
			if (match) { return acc; }
		}
		return 0;
	}
}

class Rule0 {
	constructor(rules) {
		this.prefix = rules[42];
		this.postfix = rules[31];
	}

	valid(s, n) {
		let preCount = 0, postCount = 0, acc = 0, m = this.prefix.valid(s, n);
		while (m > 0) {
			acc += m;
			preCount++;
			m = this.prefix.valid(s, n + acc);
		}
		if (preCount-- < 2) { return 0; }
		while (postCount < preCount) {
			m = this.postfix.valid(s, n + acc);
			if (m === 0) { return postCount > 0 ? acc : 0; }
			acc += m;
			postCount++;
		}
		return acc;
	}
}

export class S19a extends Solver {
	solve(input) {
		// input = '42: 9 14 | 10 1\n9: 14 27 | 1 26\n10: 23 14 | 28 1\n1: "a"\n11: 42 31\n5: 1 14 | 15 1\n19: 14 1 | 14 14\n12: 24 14 | 19 1\n16: 15 1 | 14 14\n31: 14 17 | 1 13\n6: 14 14 | 1 14\n2: 1 24 | 14 4\n0: 8 11\n13: 14 3 | 1 12\n15: 1 | 14\n17: 14 2 | 1 7\n23: 25 1 | 22 14\n28: 16 1\n4: 1 1\n20: 14 14 | 1 15\n3: 5 14 | 16 1\n27: 1 6 | 14 18\n14: "b"\n21: 14 1 | 1 14\n25: 1 1 | 1 14\n22: 14 14\n8: 42\n26: 14 22 | 1 20\n18: 15 15\n7: 14 5 | 1 21\n24: 14 1\n\nabbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa\nbbabbbbaabaabba\nbabbbbaabbbbbabbbbbbaabaaabaaa\naaabbbbbbaaaabaababaabababbabaaabbababababaaa\nbbbbbbbaaaabbbbaaabbabaaa\nbbbababbbbaaaaaaaabbababaaababaabab\nababaaaaaabaaab\nababaaaaabbbaba\nbaabbaaaabbaaaababbaababb\nabbbbabbbbaaaababbbbbbaaaababb\naaaaabbaabaaaaababaa\naaaabbaaaabbaaa\naaaabbaabbaaaaaaabbbabbbaaabbaabaaa\nbabaaabbbaaabaababbaabababaaab\naabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba';
		input = input.split("\n\n");
		let rules = [];
		input[0].split('\n').forEach(r => {
			r = r.match(/^(\d+): (.*)/);
			rules[parseInt(r[1], 10)] = new Rule(r[2]);
		});
		let msgs = input[1].split('\n');
		rules.forEach(r => r.connect(rules));
		let valid = msgs.filter(m => rules[0].valid(m, 0) === m.length);
		let r0 = new Rule0(rules);
		let validLoop = msgs.filter(m => r0.valid(m, 0) === m.length);
		this.setState({ solution: `Input Length: ${input.length}\nRules: ${rules.length}\nMessages: ${msgs.length}\nValid: ${valid.length}\nValid (loop): ${validLoop.length}` });
	}
}

export class S19b extends Solver {
}