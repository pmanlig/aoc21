import Solver from './Solver';

export class S13a extends Solver {
	fold(line, dots) {
		let newDots = [], map = [];
		let add = d => {
			if (map[d.y] === undefined) map[d.y] = [];
			if (map[d.y][d.x] === undefined) {
				map[d.y][d.x] = true;
				newDots.push(d);
			}
		}
		dots.forEach(d => {
			if (line.axis === "x") {
				if (d.x < line.coordinate) { add(d); }
				else add({ x: 2 * line.coordinate - d.x, y: d.y });
			} else /* if (line.axis === "y") */ {
				if (d.y < line.coordinate) { add(d); }
				else add({ x: d.x, y: 2 * line.coordinate - d.y });
			}
		});
		return newDots;
	}

	image(dots) {
		let maxX = 0, maxY = 0;
		dots.forEach(d => {
			if (d.x > maxX) maxX = d.x;
			if (d.y > maxY) maxY = d.y;
		});
		let img = [];
		for (let y = 0; y <= maxY; y++) {
			img[y] = [];
			for (let x = 0; x <= maxX; x++) { img[y][x] = 1; }
		}
		dots.forEach(d => { img[d.y][d.x] = 0; });
		return img;
	}

	solve(input) {
		let test = "6,10\n0,14\n9,10\n0,3\n10,4\n4,11\n6,0\n6,12\n4,1\n0,13\n10,12\n3,4\n3,0\n8,4\n1,10\n2,14\n8,10\n9,0"
		test = test.split('\n').map(c => /^(\d+),(\d+)$/.exec(c)).map(c => { return { x: parseInt(c[1]), y: parseInt(c[2]) } });
		test = this.fold({ axis: "y", coordinate: 7 }, test);
		this.assert(test.length, 17);

		input = input.split('\n\n');
		let dots = input[0].split('\n').map(c => /^(\d+),(\d+)$/.exec(c)).map(c => { return { x: parseInt(c[1]), y: parseInt(c[2]) } });
		let folds = input[1].split('\n').map(f => /^fold along (x|y)=(\d+)$/.exec(f)).map(f => { return { axis: f[1], coordinate: parseInt(f[2]) } });
		dots = this.fold(folds.shift(), dots);
		let firstFold = dots.length;
		while (folds.length > 0) {
			dots = this.fold(folds.shift(), dots);
		}

		this.setState({ solution: `Remaining dots after first fold: ${firstFold}`, data: this.image(dots), scale: 5 });
	}
}

export class S13b extends Solver {
}