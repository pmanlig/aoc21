//import React from 'react';
import Solver from './Solver';

export class S10a extends Solver {
	product(input) {
		let ones = 0, threes = 0;
		for (let i = 1; i < input.length; i++) {
			if (input[i] - input[i - 1] === 1) ones++;
			if (input[i] - input[i - 1] === 3) threes++;
		}
		return ones * threes;
	}

	validate(input) {
		for (let i = 1; i < input.length; i++) {
			if (input[i] - input[i - 1] > 3) { return false; }
		}
		return true;
	}

	off(n, removable, i) {
		for (let j = 0; j < removable.length; j++) {
			if (removable[j] === n) {
				return (((1 << j) & i) !== 0);
			}
		}
		return false;
	}

	remove(input, removable, i) {
		return input.filter(n => !this.off(n, removable, i));
	}

	count(input, removes) {
		let cnt = 0;
		for (let i = 0; i < (2 ** removes.length); i++) {
			if (this.validate(this.remove(input, removes, i))) { cnt++; }
		}
		return cnt;
	}

	combinations(input) {
		let removable = [[]];
		for (let i = 1; i < input.length - 1; i++) {
			if (input[i + 1] - input[i - 1] < 4) {
				removable[removable.length - 1].push(input[i]);
			} else if (removable[removable.length - 1].length > 0) {
				removable.push([]);
			}
		}
		console.log(this.count(input, [5]));
		return removable.filter(x => x.length > 0).map(x => this.count(input, x)).reduce((a, b) => a * b, 1);
	}

	solve(input) {
		// input = "16\n10\n15\n5\n1\n11\n7\n19\n6\n12\n4";
		// input = "28\n33\n18\n42\n31\n14\n46\n20\n48\n47\n24\n23\n49\n45\n19\n38\n39\n11\n1\n32\n25\n35\n8\n17\n7\n9\n4\n2\n34\n10\n3";
		input = input.split('\n').map(n => parseInt(n, 10)).sort((a, b) => a - b);
		input.push(input[input.length - 1] + 3);
		input.unshift(0);
		console.log(input);
		this.setState({ solution: `Product: ${this.product(input)}\nCombinations: ${this.combinations(input)}` });
	}
}

export class S10b extends Solver {
}