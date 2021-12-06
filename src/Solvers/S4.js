import Solver from './Solver';

export class S4a extends Solver {

	solve(input) {
		let win = (board) => {
			for (let i = 0; i < 5; i++) {
				if (board[i * 5] === 'X' && board[i * 5 + 1] === 'X' && board[i * 5 + 2] === 'X' && board[i * 5 + 3] === 'X' && board[i * 5 + 4] === 'X') return true;
				if (board[i] === 'X' && board[i + 5] === 'X' && board[i + 10] === 'X' && board[i + 15] === 'X' && board[i + 20] === 'X') return true;
			}
			return false;
		}

		// eslint-disable-next-line
		// input = "7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1\n\n22 13 17 11  0\n8  2 23  4 24\n21  9 14 16  7\n6 10  3 18  5\n1 12 20 15 19\n\n3 15  0  2 22\n9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6\n\n14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n2  0 12  3  7\n";
		input = input.split('\n');
		// input = input.map(s => /^(\w+)$/.exec(s).splice(1));
		// input = input.map(s => parseInt(s));
		let rnd = input[0].split(',').map(n => parseInt(n));
		input = input.slice(2);
		let boards = [];
		let winners = [];
		while (input.length > 0) {
			boards.push(input.slice(0, 5).join(' ').match(/(\d+)/g).map(n => parseInt(n)));
			input = input.slice(5);
			if (input.length > 0) { input = input.slice(1); }
		}
		while (rnd.length > 0 && boards.length > 0) {
			let n = rnd.shift();
			boards = boards.map(b => b.map(x => x === n ? 'X' : x));
			winners = winners.concat(boards.filter(b => win(b))
				.map(b => { return { board: b, num: n, score: n * b.filter(x => x !== 'X').reduce((a, b) => a + b) } }));
			boards = boards.filter(b => !win(b));
		}
		this.setState({ solution: `First winner's score: ${winners[0].score}\nLast winner's score: ${winners[winners.length - 1].score}` });
	}
}

export class S4b extends Solver {
}