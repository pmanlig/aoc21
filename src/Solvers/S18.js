import Solver from './Solver';

class Element {
	constructor(num) {
		this.num = num;
	}

	explode() { return null; }
	toString() { return this.num; }
	addLeft(num) { this.num += num; }
	addRight(num) { this.num += num; }
	split() {
		return this.num > 9 ?
			new Pair(new Element(Math.floor(this.num / 2)), new Element(Math.floor(this.num / 2) + this.num % 2)) :
			null;
	}
	magnitude() { return this.num; }
}

class Pair {
	constructor(left, right) {
		this.left = left;
		this.right = right;
	}

	add(other) {
		let result = new Pair(this, other);
		result.reduce();
		return result;
	}

	addLeft(num) {
		this.left.addLeft(num);
	}

	addRight(num) {
		this.right.addRight(num);
	}

	reduce() {
		// console.log("Reduce", this.toString());
		while (this.explode() !== null || this.split() != null) {
			// console.log("Reducing", this.toString());
		}
		return this;
	}

	explode(level) {
		level = level || 0;
		level++;
		if (level > 3) {
			if (this.left.num === undefined) {
				let ex = this.left;
				this.left = new Element(0);
				this.right.addLeft(ex.right.num);
				return [ex.left.num, null];
			}
			if (this.right.num === undefined) {
				let ex = this.right;
				this.left.addRight(ex.left.num);
				this.right = new Element(0);
				return [null, ex.right.num];
			}
			return null;
		}
		let ex = this.left.explode(level);
		if (ex !== null) {
			if (ex[1] !== null) {
				this.right.addLeft(ex[1]);
				return [null, null];
			}
			return ex;
		}
		ex = this.right.explode(level);
		if (ex !== null) {
			if (ex[0] !== null) {
				this.left.addRight(ex[0]);
				return [null, null];
			}
			return ex;
		}
		return null;
	}

	split() {
		let s = this.left.split();
		if (s !== null) {
			this.left = s;
			return this;
		}
		s = this.right.split();
		if (s !== null) {
			this.right = s;
			return this;
		}
		return null;
	}

	magnitude() {
		return 3 * this.left.magnitude() + 2 * this.right.magnitude();
	}

	toString() {
		return "[" + this.left.toString() + "," + this.right.toString() + "]";
	}

	static fromString(data) {
		if (/^(\d+)$/.test(data)) { return new Element(parseInt(data)); }
		let pos = 1, level = 0;
		while (data[pos] !== ',' || level > 0) {
			if (data[pos] === '[') level++;
			if (data[pos] === ']') level--;
			pos++;
		}
		return new Pair(Pair.fromString(data.substring(1, pos)), Pair.fromString(data.substring(pos + 1, data.length - 1)));
	}
}

export class S18a extends Solver {
	solve(input) {
		/*
		let test = Pair.fromString("[1,1]").add(Pair.fromString("[2,2]")).add(Pair.fromString("[3,3]")).add(Pair.fromString("[4,4]"));
		this.assert(test.toString(), "[[[[1,1],[2,2]],[3,3]],[4,4]]");
		test = test.add(Pair.fromString("[5,5]"));
		this.assert(test.toString(), "[[[[3,0],[5,3]],[4,4]],[5,5]]");
		test = test.add(Pair.fromString("[6,6]"));
		this.assert(test.toString(), "[[[[5,0],[7,4]],[5,5]],[6,6]]");
		this.assert(Pair.fromString("[[9,1],[1,9]]").magnitude(), 129);
		this.assert(Pair.fromString("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]").magnitude(), 1384);
		let test2 = [
			Pair.fromString("[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]"),
			Pair.fromString("[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]"),
			Pair.fromString("[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]"),
			Pair.fromString("[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]"),
			Pair.fromString("[7,[5,[[3,8],[1,4]]]]"),
			Pair.fromString("[[2,[2,2]],[8,[8,1]]]"),
			Pair.fromString("[2,9]"),
			Pair.fromString("[1,[[[9,3],9],[[9,0],[0,7]]]]"),
			Pair.fromString("[[[5,[7,4]],7],1]"),
			Pair.fromString("[[[[4,2],2],6],[8,7]]")
		];
		let s = test2[0];
		s = s.add(test2[1]);
		console.log(s, s.toString());
		this.assert(s.toString(), "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]");
		for (let i = 2; i < test.length; i++) {
			s = s.add(test[i]);
		}
		this.assert(s.toString(), "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]");
		*/
		let tests = [
			["[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]", "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]", "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]"],
			["[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]", "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]", "[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]"],
			["[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]", "[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]", "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]"],
			["[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]", "[7,[5,[[3,8],[1,4]]]]", "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]"],
			["[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]", "[[2,[2,2]],[8,[8,1]]]", "[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]"],
			["[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]", "[2,9]", "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]"],
			["[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]", "[1,[[[9,3],9],[[9,0],[0,7]]]]", "[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]"],
			["[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]", "[[[5,[7,4]],7],1]", "[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]"],
			["[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]", "[[[[4,2],2],6],[8,7]]", "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"],
		];
		tests.forEach(t => {
			this.assert(
				Pair.fromString(t[0])
					.add(Pair.fromString(t[1]))
					.toString(),
				t[2]);
		});
		let t = Pair.fromString(tests[0][0]);
		for (let i = 0; i < tests.length; i++) {
			t = t.add(Pair.fromString(tests[i][1]));
			this.assert(t.toString(), tests[i][2]);
		}

		input = input.split('\n');
		let sum = Pair.fromString(input[0]);
		for (let i = 1; i < input.length; i++) {
			sum = sum.add(Pair.fromString(input[i]));
		}
		let max = 0;
		for (let i = 0; i < input.length; i++) {
			for (let j = i + 1; j < input.length; j++) {
				let m = Pair.fromString(input[i]).add(Pair.fromString(input[j])).magnitude();
				if (m > max) { max = m; }
			}
		}
		this.setState({ solution: `Sum magnitude: ${sum.magnitude()}\nMaximum magnitude: ${max}` });
	}
}

export class S18b extends Solver {
}