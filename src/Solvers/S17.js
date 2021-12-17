import Solver from './Solver';

export class S17a extends Solver {
	hit(vx, vy, target) {
		let x = 0, y = 0;
		while (y > target.miny) {
			x += vx;
			y += vy;
			if (x <= target.maxx && x >= target.minx && y <= target.maxy && y >= target.miny) return true;
			if (vx > 0) vx--;
			vy--;
		}
		return false;
	}

	solve(input) {
		input = /^target area: x=(\d+)..(\d+), y=([-0-9]+)..([-0-9]+)$/.exec(input).slice(1).map(n => parseInt(n));
		let target = {
			minx: Math.min(input[0], input[1]),
			maxx: Math.max(input[0], input[1]),
			miny: Math.min(input[2], input[3]),
			maxy: Math.max(input[2], input[3])
		}
		let length = x => (x + 1) * x / 2;
		let depth = (y, n) => y * n - n * (n - 1) / 2;
		let minXVelocity = 0;
		let maxYVelocity = -(target.miny + 1);
		while (length(minXVelocity) < input[0]) minXVelocity++;
		let ymax = 0;
		for (let n = 1; n < 2 * maxYVelocity + 2; n++) { if (depth(maxYVelocity, n) > ymax) { ymax = depth(maxYVelocity, n); } }
		let options = 0;
		for (let xv = minXVelocity; xv <= target.maxx; xv++) {
			for (let yv = target.miny; yv <= maxYVelocity; yv++) {
				if (this.hit(xv, yv, target)) { options++; }
			}
		}
		this.setState({ solution: `Minimum X velocity: ${minXVelocity}\nMaximum X velocity: ${target.maxx}\nMinimum Y velocity: ${target.miny}\nMaximum Y velocity: ${maxYVelocity}\nMaximum Y coordinate: ${ymax}\nPossible vectors: ${options}` });
	}
}

export class S17b extends Solver {
}