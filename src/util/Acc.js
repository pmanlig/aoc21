export class Instruction {
	constructor(i, a) {
		this.instr = i;
		this.arg = a;
	}
}

export class Computer {
	acc = (i) => {
		this.res += i;
		return 1;
	}

	jmp = (i) => {
		return i;
	}

	nop = () => {
		return 1;
	}

	static parse(prg) {
		return prg.split('\n').map(l => new Instruction(l.match(/^\w+/).shift(), parseInt(l.match(/[-\d]+$/).shift(), 10)));
	}

	constructor(prg) {
		this.prg = prg;
		this.res = 0;
		this.ip = 0;
		this.instructions = {
			acc: this.acc,
			jmp: this.jmp,
			nop: this.nop
		};
	}

	run(log) {
		while (this.ip < this.prg.length) {
			if (log) console.log(`${this.ip}: ${this.prg[this.ip].instr} ${this.prg[this.ip].arg}, Res: ${this.res}`);
			this.ip += this.instructions[this.prg[this.ip].instr](this.prg[this.ip].arg);
		}
	}

	debug(log) {
		let seen = [];
		while (!seen.includes(this.ip) && this.ip < this.prg.length) {
			seen.push(this.ip);
			if (log) console.log(`${this.ip}: ${this.prg[this.ip].instr} ${this.prg[this.ip].arg}, Res: ${this.res}`);
			this.ip += this.instructions[this.prg[this.ip].instr](this.prg[this.ip].arg);
		}
	}
}