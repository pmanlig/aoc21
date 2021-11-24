//import React from 'react';
import Solver from './Solver';

class Mask {
	constructor(m) {
		this.high = parseInt(m.substring(0, 20), 2);
		this.low = parseInt(m.substring(20), 2);
	}

	pad(s, len) {
		while (s.length < len) { s = '0' + s; }
		return s;
	}

	applyOR(x, log) {
		let val = (2 ** 16) * (Math.floor(x / (2 ** 16)) | this.high) + ((x & 65535) | this.low);
		if (log) {
			console.log(`OR: ${x} | (${this.high} + ${this.low})`);
			console.log(`${this.pad(this.high.toString(2), 20)} + ${this.pad(this.low.toString(2), 16)}`);
			console.log(`${this.pad(Math.floor(x / (2 ** 16)).toString(2), 20)} + ${this.pad((x & 65535).toString(2), 16)}`);
			console.log(`${this.pad(Math.floor(val / (2 ** 16)).toString(2), 20)} + ${this.pad((val & 65535).toString(2), 16)}`);
		}
		return val;
	}

	applyAND(x, log) {
		let val = (2 ** 16) * (Math.floor(x / (2 ** 16)) & this.high) + ((x & 65535) & this.low);
		if (log) {
			console.log(`AND: ${x} & (${this.high} + ${this.low})`);
			console.log(`${this.pad(this.high.toString(2), 20)} + ${this.pad(this.low.toString(2), 16)}`);
			console.log(`${this.pad(Math.floor(x / (2 ** 16)).toString(2), 20)} + ${this.pad((x & 65535).toString(2), 16)}`);
			console.log(`${this.pad(Math.floor(val / (2 ** 16)).toString(2), 20)} + ${this.pad((val & 65535).toString(2), 16)}`);
		}
		return val;
	}
}

class BitMasker1 {
	constructor() {
		this.data = [];
	}

	setMask(mask) {
		mask = mask.match(/^mask = (.*)/)[1];
		this.orMask = new Mask(mask.replace(/X/g, '0'));
		this.andMask = new Mask(mask.replace(/X/g, '1'));
	}

	writeMem(inst) {
		inst = inst.match(/^mem\[(\d+)] = (\d+)/);
		let addr = parseInt(inst[1], 10);
		let val = this.andMask.applyAND(this.orMask.applyOR(parseInt(inst[2], 10)));
		this.data[addr] = val;
	}

	parse(inst) {
		if (inst.startsWith("mask")) {
			this.setMask(inst);
		} else {
			this.writeMem(inst);
		}
	}

	sum() {
		return this.data.reduce((a, b) => a + b, 0);
	}
}

class BitMasker2 {
	constructor() {
		this.data = {};
	}

	setMask(inst) {
		this.mask = inst.match(/^mask = (.*)/)[1];
		this.orMask = new Mask(this.mask.replace(/X/g, '0'));
	}

	generateAddresses(addr) {
		let parts = this.mask.split('');
		let andMask = new Mask(parts.map(c => c === 'X' ? '0' : '1').join(''));
		addr = andMask.applyAND(this.orMask.applyOR(addr));
		let bits = [];
		for (let i = 0; i < parts.length; i++) {
			if (parts[parts.length - 1 - i] === 'X') { bits.push(i); }
		}
		let result = [addr];
		for (let i = 1; i < 2 ** bits.length; i++) {
			let add = 0;
			for (let j = 0; j < bits.length; j++) {
				add += ((i >>> j) & 1) * (2 ** bits[j]);
			}
			result.push(addr + add);
		}
		return result;
	}

	writeMem(inst) {
		inst = inst.match(/^mem\[(\d+)] = (\d+)/);
		let addr = this.generateAddresses(parseInt(inst[1], 10));
		let val = parseInt(inst[2], 10);
		addr.forEach(a => this.data[a] = val);
	}

	parse(inst) {
		if (inst.startsWith("mask")) {
			this.setMask(inst);
		} else {
			this.writeMem(inst);
		}
	}

	sum() {
		return Object.keys(this.data).map(k => this.data[k]).reduce((a, b) => a + b, 0);
	}
}

export class S14a extends Solver {
	solve(input) {
		// input = "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X\nmem[8] = 11\nmem[7] = 101\nmem[8] = 0";
		// input = "mask = 000000000000000000000000000000X1001X\nmem[42] = 100\nmask = 00000000000000000000000000000000X0XX\nmem[26] = 1";
		input = input.split('\n');
		let mask1 = new BitMasker1(), mask2 = new BitMasker2();
		input.forEach(i => {
			mask1.parse(i);
			mask2.parse(i);
		});
		this.setState({ solution: `Sum(1): ${mask1.sum()}\nSum(2): ${mask2.sum()}` });
	}
}

export class S14b extends Solver {
}