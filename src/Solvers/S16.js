import Solver from './Solver';

const hex2binary = {
	"0": "0000", "1": "0001", "2": "0010", "3": "0011", "4": "0100", "5": "0101", "6": "0110", "7": "0111",
	"8": "1000", "9": "1001", "A": "1010", "B": "1011", "C": "1100", "D": "1101", "E": "1110", "F": "1111",
}

function bin2dec(data) {
	let val = 0;
	for (let p = 0; p < data.length; p++) {
		val *= 2;
		val += data[p] === '1' ? 1 : 0;
	}
	return val;
}

class Packet {
	constructor(version, type) {
		this.version = version;
		this.type = type;
	}

	versionSum() {
		return this.version;
	}
}

class DataPacket extends Packet {
	constructor(version, type, trans) {
		super(version, type);
		this.value = 0;
		let v;
		do {
			this.value *= 16;
			v = trans.readBits(5);
			this.value += bin2dec(v.slice(1));
		} while (v[0] === "1");
	}
}

class OperatorPacket extends Packet {
	constructor(version, type, trans) {
		super(version, type);
		this.sub = [];
		if (trans.readBits(1) === "0") {
			let len = bin2dec(trans.readBits(15));
			for (let p = trans.pos + len; trans.pos < p; this.sub.push(trans.readPacket()));
		} else {
			for (let n = bin2dec(trans.readBits(11)); n-- > 0; this.sub.push(trans.readPacket()));
		}
		switch (type) {
			case 0:
				this.value = this.sub.map(p => p.value).reduce((a, b) => a + b, 0);
				break;
			case 1:
				this.value = this.sub.map(p => p.value).reduce((a, b) => a * b, 1);
				break;
			case 2:
				this.value = Math.min(...this.sub.map(p => p.value));
				break;
			case 3:
				this.value = Math.max(...this.sub.map(p => p.value));
				break;
			case 5:
				this.value = (this.sub[0].value > this.sub[1].value) ? 1 : 0;
				break;
			case 6:
				this.value = (this.sub[0].value < this.sub[1].value) ? 1 : 0;
				break;
			case 7:
				this.value = (this.sub[0].value === this.sub[1].value) ? 1 : 0;
				break;
			default:
				this.value = 0;
				break;
		}
	}

	versionSum() {
		return this.version + this.sub.map(p => p.versionSum()).reduce((a, b) => a + b, 0);
	}
}

class Transmission {
	constructor(hexData) {
		this.data = hexData.split('').map(h => hex2binary[h]).join('');
		this.pos = 0;
	}

	eot() {
		return this.pos + 6 >= this.data.length;
	}

	readBits(n) {
		this.pos += n;
		return this.data.slice(this.pos - n, this.pos);
	}

	readPacket() {
		let version = bin2dec(this.readBits(3));
		let type = bin2dec(this.readBits(3));
		if (type === 4) {
			return new DataPacket(version, type, this);
		} else {
			return new OperatorPacket(version, type, this);
		}
	}
}

export class S16a extends Solver {
	solve(input) {
		let t = new Transmission("D2FE28");
		let p = t.readPacket();
		this.assert(p.value, 2021);
		this.assert(bin2dec("11011"), 27);
		t = new Transmission("38006F45291200");
		p = t.readPacket();
		this.assert(p.version, 1);
		this.assert(p.sub.length, 2);
		let transmission = new Transmission(input);
		let packets = [];
		while (!transmission.eot()) {
			packets.push(transmission.readPacket());
		}
		let versionSum = packets.map(p => p.versionSum()).reduce((a, b) => a + b, 0);
		let value = packets.map(p => p.value).reduce((a, b) => a + b, 0);
		this.setState({ solution: `Packets read: ${packets.length}\nSum of all version numbers: ${versionSum}\nTotal packet value: ${value}` });
	}
}

export class S16b extends Solver {
}