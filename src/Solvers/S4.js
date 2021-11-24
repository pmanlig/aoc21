// import React from 'react';
import Solver from './Solver';

class Passport {
	constructor(d) {
		let fds = d.split(/[ \n]/).sort();
		fds.forEach(f => {
			if (f.startsWith("byr:")) { this.byr = parseInt(f.substring(4), 10); }
			if (f.startsWith("iyr:")) { this.iyr = parseInt(f.substring(4), 10); }
			if (f.startsWith("eyr:")) { this.eyr = parseInt(f.substring(4), 10); }
			if (f.startsWith("hgt:")) { this.hgt = { l: parseInt(f.substring(4), 10), u: f.substring(4).split(/\d+/)[1] }; }
			if (f.startsWith("hcl:")) { this.hcl = f.substring(4); }
			if (f.startsWith("ecl:")) { this.ecl = f.substring(4); }
			if (f.startsWith("pid:")) { this.pid = f.substring(4); }
		});
	}

	complete() {
		return this.byr !== undefined && this.iyr !== undefined && this.eyr !== undefined && this.hgt !== undefined && this.hcl !== undefined && this.ecl !== undefined && this.pid !== undefined;
	}

	valid(debug) {
		if (this.byr < 1920 || this.byr > 2002) {
			if (debug) console.log("Incorrect birth year");
			return false;
		}
		if (this.iyr < 2010 || this.iyr > 2020) {
			if (debug) console.log("Incorrect issue year");
			return false;
		}
		if (this.eyr < 2020 || this.eyr > 2030) {
			if (debug) console.log("Incorrect expiration year");
			return false;
		}
		if (this.hgt.u !== "cm" && this.hgt.u !== "in") {
			if (debug) console.log("Invalid height unit");
			return false;
		}
		if (this.hgt.u === "cm") {
			if (this.hgt.l < 150 || this.hgt.l > 193) {
				if (debug) console.log("Invalid length");
				return false;
			}
		}
		if (this.hgt.u === "in") {
			if (this.hgt.l < 59 || this.hgt.l > 76) {
				if (debug) console.log("Invalid length");
				return false;
			}
		}
		if (!/^#[0-9a-f]{6}$/.test(this.hcl)) {
			if (debug) console.log("Invalid hair color");
			return false;
		}
		if (!/^(amb|blu|brn|gry|grn|hzl|oth)$/.test(this.ecl)) {
			if (debug) console.log("Invalid eye color");
			return false;
		}
		if (!/^\d{9}$/.test(this.pid)) {
			if (debug) console.log("Invalid passport ID");
			return false;
		}
		return true;
	}
}

export class S4a extends Solver {
	solve(input) {
		input = input.split("\n\n").map(d => new Passport(d)).filter(p => p.complete());
		this.setState({ solution: `Passports: ${input.length}\nValid(1): ${input.length}\nValid(2): ${input.filter(p => p.valid()).length}` });
	}
}

export class S4b extends Solver {
}