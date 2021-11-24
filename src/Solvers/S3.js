// import React from 'react';
import Solver from './Solver';

export class S3a extends Solver {
	solve(input) {
		input = input.split('\n');
		let slopes = [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 1, y: 2 }];
		let trees = [0, 0, 0, 0, 0];
		for (let i = 0; i < slopes.length; i++) {
			let pos = { x: 0, y: 0 };
			while (pos.y < input.length) {
				if (input[pos.y][pos.x % input[pos.y].length] === '#') trees[i]++;
				pos.x += slopes[i].x;
				pos.y += slopes[i].y;
			}
		}
		this.setState({ solution: `Lines: ${input.length}\n# trees(1): ${trees[0]}\n# trees(2): ${trees[1]}\n# trees(3): ${trees[2]}\n# trees(4): ${trees[3]}\n# trees(5): ${trees[4]}\nProduct: ${trees.reduce((p, q) => p * q, 1)}` });
	}
}

export class S3b extends Solver {
}