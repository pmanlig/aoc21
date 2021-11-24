//import React from 'react';
import Solver from './Solver';

export class S15a extends Solver {
	newNum() {
		if (this.numbers[this.lastNum]===undefined) {
			this.numbers[this.lastNum] = this.count++;
			this.lastNum = 0;
		} else {
			let n = this.count - this.numbers[this.lastNum];
			this.numbers[this.lastNum] = this.count++;
			this.lastNum = n;
		}
	}

	solve(input) {
		// input = "0,3,6";
		this.numbers = [];
		let numbers = input.split(',').map(n => parseInt(n, 10));
		this.count = 1;
		for (let i = 0; i < numbers.length - 1; i++) {
			this.numbers[numbers[i]] = this.count++;
		}
		this.lastNum = numbers[numbers.length - 1];
		while (this.count < 2020) {
			this.newNum();
			// numbers.push(this.lastNum);
		}
		let num2020 = this.lastNum;
		while (this.count < 30000000) {
			this.newNum();
		}
		// console.log(numbers.join(','));
		this.setState({ solution: `Element #2020: ${num2020}\nElement #30000000: ${this.lastNum}` });
	}
}

export class S15b extends Solver {
}