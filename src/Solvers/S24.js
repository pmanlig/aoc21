import Solver from './Solver';

/*
class ALU {
	constructor() {
		this.registers = { w: 0, x: 0, y: 0, z: 0 };
	}

	value(b) {
		return b.match(/[wxyz]/) ? this.registers[b] : parseInt(b);
	}

	inp(a, b, input) {
		this.registers[a] = input.pop();
	}

	add(a, b) {
		this.registers[a] += this.value(b);
	}

	mul(a, b) {
		this.registers[a] *= this.value(b);
	}

	div(a, b) {
		this.registers[a] = Math.floor(this.registers[a] / this.value(b));
	}

	mod(a, b) {
		this.registers[a] = this.registers[a] % this.value(b);
	}

	eql(a, b) {
		this.registers[a] = this.registers[a] === this.value(b) ? 1 : 0;
	}

	execute(prg, input) {
		input = [...input].reverse();
		this.registers = { w: 0, x: 0, y: 0, z: 0 };
		let ip = 0;
		while (ip < prg.length) {
			this[prg[ip][0]](prg[ip][1], prg[ip][2], input);
			ip++;
		}
	}
}
//*/

export class S24a extends Solver {
	decrease(code) {
		let n = code.length - 1;
		code[n]--;
		while (code[n] === 0 && n >= 0) {
			code[n--] = 9;
			code[n]--;
		}
	}

	solve(input) {
		let expr = /inp w\nmul x 0\nadd x z\nmod x 26\ndiv z (1|26)\nadd x ([-\d]+)\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y (\d+)/g;
		let expr2 = /inp w\nmul x 0\nadd x z\nmod x 26\ndiv z (1|26)\nadd x ([-\d]+)\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y (\d+)/;
		let magic = input.match(expr).map(l => expr2.exec(l).slice(1).map(n => parseInt(n)));
		/*
		input = input.split('\n');
		input = input.map(l => /^(inp|add|mul|div|mod|eql) ([wxyz])\s?([wxyz]|[-\d]+)?$/.exec(l).slice(1));
		let alu = new ALU();
		let size = input.length / 14;
		let code = [];
		*/
		let max = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let min = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let stack = [];
		for (let i = 0; i < 14; i++) {
			if (magic[i][0] === 1) {
				stack.push({ pos: i, num: magic[i][2] });
			} else {
				let p = stack.pop();
				max[i] = 9;
				min[i] = 9;
				max[p.pos] = 9 - p.num - magic[i][1];
				min[p.pos] = max[p.pos];
				while (max[p.pos] > 9) { max[p.pos]--; max[i]--; }
				while (min[p.pos] > 1) { min[p.pos]--; min[i]--; }
				while (min[i] < 1) { min[p.pos]++; min[i]++; }
			}
		}
		this.setState({ solution: `Largest code: ${max.join('')}\nSmallest code: ${min.join('')}` });
	}
}

export class S24b extends Solver {
}