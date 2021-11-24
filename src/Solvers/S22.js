// import React from 'react';
import Solver from './Solver';

// I do not understand how this can work
function magic(p1, p2) {
	return p1.reduce((a, b, i) => (a * b * (i + 2)), 1) +
		p2.reduce((a, b, i) => (a * b * (i + 2)), 1) * 2;
}

// eslint-disable-next-line
function arrayEq(a, b) {
	return a.length === b.length && a.every((v, i) => v === b[i]);
}

export class S22a extends Solver {
	score(deck) {
		let score = 0, multiplier = 1;
		while (deck.length > 0) {
			score += multiplier++ * deck.pop();
		}
		return score;
	}

	combat(p1, p2) {
		while (p1.length > 0 && p2.length > 0) {
			if (p1[0] > p2[0]) {
				p1.push(p1.shift());
				p1.push(p2.shift());
			} else {
				p2.push(p2.shift());
				p2.push(p1.shift());
			}
		}
		return this.score(p1.concat(p2));
	}

	recurse(p1, p2) {
		let hist = new Map();
		while (p1.length > 0 && p2.length > 0) {
			let ns = magic(p1, p2);
			if (!hist.has(ns)) { hist.set(ns); }
			else { return { p1win: true, deck: p1 }; }
			// else if (hist.get(ns).some(x => arrayEq(x[0], p1) && arrayEq(x[1], p2))) { return { p1win: true, deck: p1 }; }
			// else { hist.get(ns).push([p1, p2]); }
			let p1wins = p1[0] > p2[0];
			if (p1[0] < p1.length && p2[0] < p2.length) { p1wins = this.recurse(p1.slice(1, 1 + p1[0]), p2.slice(1, 1 + p2[0])).p1win; }
			if (p1wins) {
				p1 = p1.slice(1).concat([p1[0], p2[0]]);
				p2 = p2.slice(1);
			} else {
				p2 = p2.slice(1).concat([p2[0], p1[0]]);
				p1 = p1.slice(1);
			}
		}
		return { p1win: p1.length > 0, deck: p1.length > 0 ? p1 : p2 };
	}

	solve(input) {
		// console.log(play(input.trim().split("\n\n").map(x => x.split("\n").slice(1).map(Number))).score);
		input = input.split('\n\n').map(p => p.split('\n'));
		let p1 = { name: input[0].shift() }, p2 = { name: input[1].shift() };
		p1.cards = input[0].map(c => parseInt(c, 10));
		p2.cards = input[1].map(c => parseInt(c, 10));
		let score = this.combat(p1.cards, p2.cards);
		this.setState({ solution: `Players: ${input.length}\n${p1.name} ${p1.cards.length} cards\n${p2.name} ${p2.cards.length} cards\nCombat score: ${score}\nRecursive score: Calculating...` });
		setTimeout(() => {
			p1.cards = input[0].map(c => parseInt(c, 10));
			p2.cards = input[1].map(c => parseInt(c, 10));
			// let recursiveScore = this.score(this.recurse([9, 2, 6, 3, 1], [5, 8, 4, 7, 10]).deck);
			let recursiveScore = this.score(this.recurse(p1.cards, p2.cards).deck);
			this.setState({ solution: `Players: ${input.length}\n${p1.name} ${p1.cards.length} cards\n${p2.name} ${p2.cards.length} cards\nCombat score: ${score}\nRecursive score: ${recursiveScore}` });
		}, 100);
	}
}

export class S22b extends Solver {
}