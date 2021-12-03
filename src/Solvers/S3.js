import Solver from './Solver';

function bin2dec(bin) {
	let dec = 0;
	for (let n = 0; n < bin.length; n++) {
		dec *= 2;
		if (bin[n] === 1) { dec++; }
	}
	return dec;
}

export class S3a extends Solver {
	solve(input) {
		// input = "00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010";
		input = input.split('\n').map(s => s.split('').map(n => parseInt(n)));
		// input = input.map(s => /^(\w+)$/.exec(s).splice(1));
		// input = input.map(s => parseInt(s));
		let g = [];
		for (let n = 0; n < input[0].length; n++) { g[n] = 0; }
		for (let i = 0; i < input.length; i++) {
			for (let n = 0; n < input[i].length; n++) {
				if (input[i][n] === 1) { g[n]++; }
			}
		}
		let gamma = 0, epsilon = 0;
		for (let n = 0; n < input[0].length; n++) {
			gamma *= 2;
			epsilon *= 2;
			if (g[n] > (input.length / 2)) { gamma++; }
			else { epsilon++; }
		}
		this.setState({ solution: `Gamma: ${gamma}\nEpsilon: ${epsilon}\nPower consumption: ${gamma * epsilon}` });
	}
}

export class S3b extends Solver {
	solve(input) {
		// input = "00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010";
		input = input.split('\n').map(s => s.split('').map(n => parseInt(n)));
		let oxygen = 0, co2 = 0;
		let temp = input, n = 0;
		while (temp.length > 1) {
			let c = 0;
			for (let i = 0; i < temp.length; i++) { if (temp[i][n] === 0) c++; }
			c = c > (temp.length / 2) ? 0 : 1;
			// eslint-disable-next-line
			temp = temp.filter(num => num[n] === c);
			n++;
		}
		oxygen = bin2dec(temp[0]);
		temp = input;
		n = 0;
		while (temp.length > 1) {
			let c = 0;
			for (let i = 0; i < temp.length; i++) { if (temp[i][n] === 1) c++; }
			c = c < (temp.length / 2) ? 1 : 0;
			// eslint-disable-next-line
			temp = temp.filter(num => num[n] === c);
			n++;
		}
		co2 = bin2dec(temp[0]);
		this.setState({ solution: `Oxygen generator rating: ${oxygen}\nCO2 scrubber rating: ${co2}\nLife support rating: ${oxygen * co2}` });
	}
}