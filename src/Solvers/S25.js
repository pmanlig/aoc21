// import React from 'react';
import Solver from './Solver';

const divisor = 20201227;

export class S25a extends Solver {
	transform(s, v) {
		v = (v * s) % divisor;
		return v;
	}

	calc(subject, loop) {
		let val = 1;
		for (let i = 0; i < loop; i++) { val = this.transform(val, subject); }
		this.setState({ key: val });
	}

	loop(val, e1, e2, lp) {
		const step = 100000;
		let tgt = lp + step;
		while (val !== e1 && val !== e2 && lp < tgt) {
			val = this.transform(val, 7);
			lp++;
		}
		this.setState({ loop: lp });
		if (val !== e1 && val !== e2) {
			setTimeout(() => this.loop(val, e1, e2, lp), 1);
		} else {
			setTimeout(() => this.calc(val === e1 ? e2 : e1, lp), 1);
		}
	}

	solve(input) {
		// input = "5764801\n17807724";
		input = input.split('\n').map(k => parseInt(k, 10));
		let v1 = 1;
		for (let i = 0; i < 8; i++) { v1 = this.transform(v1, 7); }
		let v2 = 1;
		for (let i = 0; i < 11; i++) { v2 = this.transform(v2, 7); }
		let k1 = 1;
		for (let i = 0; i < 8; i++) { k1 = this.transform(k1, v2); }
		let k2 = 1;
		for (let i = 0; i < 11; i++) { k2 = this.transform(k2, v1); }
		this.setState({ val1: v1, val2: v2, key1: k1, key2: k2 });
		setTimeout(() => this.loop(1, input[0], input[1], 0), 1);
	}

	customRender() {
		let { val1, val2, key1, key2, loop, key } = this.state;
		return <div>
			<p>--- Test ---</p>
			<p>Value 1: {val1} {val1 === 5764801 ? "Match!" : "(Expected 5764801)"}</p>
			<p>Key 1: {key1}</p>
			<p>Value 2: {val2} {val2 === 17807724 ? "Match!" : "(Expected 17807724)"}</p>
			<p>Key 2: {key2}</p>
			<p>&nbsp;</p>
			<p>--- Actual ---</p>
			{key === undefined && <p>Scanning for loop size: {loop}</p>}
			{key && <p>Loop size found: {loop}</p>}
			{key && <p>Key: {key}</p>}
		</div>;
	}
}

export class S25b extends Solver {
}