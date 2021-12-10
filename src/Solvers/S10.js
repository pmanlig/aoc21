import Solver from './Solver';

export class S10a extends Solver {
	openChars = " ([{<";
	closeChars = " )]}>";
	errorScore = { ")": 3, "]": 57, "}": 1197, ">": 25137 };

	parse(line) {
		let match = [];
		for (let p = 0; p < line.length; p++) {
			if (this.openChars.indexOf(line[p]) > -1) {
				match.push(line[p]);
			} else if (match.length === 0 || this.closeChars[this.openChars.indexOf(match.pop())] !== line[p]) {
				return this.errorScore[line[p]];
			}
		}
		return match;
	}

	completionScore(c) {
		let score = 0;
		for (let p = c.length; p > 0;) {
			score = 5 * score + this.openChars.indexOf(c[--p]);
		}
		return score;
	}

	solve(input) {
		// input = "[({(<(())[]>[[{[]{<()<>>\n[(()[<>])]({[<{<<[]>>(\n{([(<{}[<>[]}>{[]{[(<()>\n(((({<>}<{<{<>}{[]{[]{}\n[[<[([]))<([[{}[[()]]]\n[{[{({}]{}}([{[{{{}}([]\n{<[[]]>}<{[{[{[]{()[[[]\n[<(<(<(<{}))><([]([]()\n<{([([[(<>()){}]>(<<{{\n<{([{{}}[<[[[<>{}]]]>[]]";
		input = input.split('\n').map(l => this.parse(l));
		this.assert(this.parse("[({(<(())[]>[[{[]{<()<>>") > 0, false);
		this.assert(this.parse("{([(<{}[<>[]}>{[]{[(<()>") > 0, true);
		this.assert(this.completionScore("<{(["), 294);
		let corrupted = input.filter(l => l > 0).reduce((a, b) => a + b, 0);
		let incomplete = input.filter(l => !(l > 0)).map(l => this.completionScore(l)).sort((a, b) => a - b);
		this.setState({ solution: `Corrupted lines' total score: ${corrupted}\nWinning autocomplete score: ${incomplete[(incomplete.length - 1) / 2]}` });
	}
}

export class S10b extends Solver {
}