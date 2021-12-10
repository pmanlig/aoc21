import Solver from './Solver';

export class S10a extends Solver {
	opening(char) {
		return char === '(' || char === '[' || char === '<' || char === '{';
	}

	matching(opening, closing) {
		return (opening === '(' && closing === ')') ||
			(opening === '[' && closing === ']') ||
			(opening === '<' && closing === '>') ||
			(opening === '{' && closing === '}');
	}

	errorScore(char) {
		if (char === ')') return 3;
		if (char === ']') return 57;
		if (char === '}') return 1197;
		if (char === '>') return 25137;
	}

	parse(line) {
		let match = [];
		for (let p = 0; p < line.length; p++) {
			if (this.opening(line[p])) {
				match.push(line[p]);
			} else if (match.length === 0 || !this.matching(match.pop(), line[p])) {
				return this.errorScore(line[p]);
			}
		}
		return match;
	}

	completionScore(c) {
		let openers = { "(": 1, "[": 2, "{": 3, "<": 4 };
		let score = 0;
		for (let p = c.length; p > 0;) {
			score = 5 * score + openers[c[--p]];
		}
		return score;
	}

	solve(input) {
		// input = "[({(<(())[]>[[{[]{<()<>>\n[(()[<>])]({[<{<<[]>>(\n{([(<{}[<>[]}>{[]{[(<()>\n(((({<>}<{<{<>}{[]{[]{}\n[[<[([]))<([[{}[[()]]]\n[{[{({}]{}}([{[{{{}}([]\n{<[[]]>}<{[{[{[]{()[[[]\n[<(<(<(<{}))><([]([]()\n<{([([[(<>()){}]>(<<{{\n<{([{{}}[<[[[<>{}]]]>[]]";
		input = input.split('\n').map(l => this.parse(l.split('')));
		// input = input.map(n => parseInt(n));
		// input = input.map(e => /^(\w+)$/.exec(e).slice(1));
		// console.log(this.parse("[({(<(())[]>[[{[]{<()<>>".split(''))); // expected false
		// console.log(this.parse("{([(<{}[<>[]}>{[]{[(<()>".split(''))); // expected true
		let corrupted = input.filter(l => l > 0).reduce((a, b) => a + b, 0);
		// console.log(this.completionScore("".split(''))); // expected 0
		// console.log(this.completionScore("<{([".split(''))); // expected 294
		let incomplete = input.filter(l => !(l > 0)).map(l => this.completionScore(l)).sort((a, b) => a - b);
		this.setState({ solution: `Corrupted lines' total score: ${corrupted}\nWinning autocomplete score: ${incomplete[(incomplete.length - 1) / 2]}` });
	}
}

export class S10b extends Solver {
}