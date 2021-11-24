// import React from 'react';
import Solver from './Solver';
import { Computer, Instruction } from '../util/Acc';

export class S8a extends Solver {
	solve(input) {
		input = Computer.parse(input);
		let cmp = new Computer(input);
		cmp.debug();
		let stop = cmp.res;
		let ok = 0;
		for (let i = 0; i < input.length; i++) {
			if (input[i].instr === "acc") continue;
			let patch = input.concat([]);
			patch.splice(i, 1, new Instruction(input[i].instr === "nop" ? "jmp" : "nop", input[i].arg));
			cmp = new Computer(patch);
			cmp.debug();
			if (cmp.ip === patch.length) {
				ok = cmp.res;
				break;
			}
		}
		this.setState({ solution: `Result: ${stop}\nPatched: ${ok}` });
	}
}

export class S8b extends Solver {
}