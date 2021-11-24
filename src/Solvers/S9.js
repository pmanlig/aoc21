// import React from 'react';
import Solver from './Solver';

export class S9a extends Solver {
	findInvalid(nums) {
		for (let i = 25; i < nums.length; i++) {
			if (null == this.validate(nums, i)) { return i; }
		}
	}

	validate(nums, i) {
		for (let x = Math.max(0, i - 25); x < i - 1; x++) {
			for (let y = x + 1; y < i; y++) {
				if (nums[x] + nums[y] === nums[i]) {
					// console.log(`${i}: ${nums[i]} = ${nums[x]} + ${nums[y]}`);
					return { x: x, y: y };
				}
			}
		}
		return null;
	}

	findSum(nums, x) {
		for (let i = 0; i < x - 1; i++) {
			let acc = nums[i];
			for (let j = i + 1; j < x; j++) {
				acc += nums[j];
				if (nums[x] === acc) {
					console.log(`${i}-${j}`);
					let smallest = nums[i], largest = nums[i];
					for (let n = i + 1; n < j + 1; n++) {
						if (nums[n] < smallest) { smallest = nums[n]; }
						if (nums[n] > largest) { largest = nums[n]; }
					}
					return smallest + largest;
				}
			}
		}
	}

	solve(input) {
		let nums = input.split('\n').map(n => parseInt(n, 10));
		let firstInvalid = this.findInvalid(nums);
		let sum = this.findSum(nums, firstInvalid);
		this.setState({ solution: `First invalid: ${nums[firstInvalid]}\nSum: ${sum}` });
	}
}

export class S9b extends Solver {
}