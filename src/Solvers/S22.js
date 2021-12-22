import Solver from './Solver';

class Region {
	constructor(on, fx, tx, fy, ty, fz, tz) {
		this.on = on;
		this.fx = fx;
		this.tx = tx;
		this.fy = fy;
		this.ty = ty;
		this.fz = fz;
		this.tz = tz;
	}

	count() {
		if (!this.on) return 0;
		return (this.tx - this.fx) * (this.ty - this.fy) * (this.tz - this.fz);
	}

	contains(b) {
		return b.fx >= this.fx && b.fy >= this.fy && b.fz >= this.fz &&
			b.tx <= this.tx && b.ty <= this.ty && b.tz <= this.tz;
	}

	disjoint(b) {
		return this.fx >= b.tx || this.tx <= b.fx || this.fy >= b.ty || this.ty <= b.fy || this.fz >= b.tz || this.tz <= b.fz;
	}

	splitX(x) {
		if (x <= this.fx || x > this.tx) return [this];
		return [
			new Region(this.on, this.fx, x, this.fy, this.ty, this.fz, this.tz),
			new Region(this.on, x, this.tx, this.fy, this.ty, this.fz, this.tz)];
	}

	splitY(y) {
		if (y <= this.fy || y > this.ty) return [this];
		return [
			new Region(this.on, this.fx, this.tx, this.fy, y, this.fz, this.tz),
			new Region(this.on, this.fx, this.tx, y, this.ty, this.fz, this.tz)];
	}

	splitZ(z) {
		if (z <= this.fz || z > this.tz) return [this];
		return [
			new Region(this.on, this.fx, this.tx, this.fy, this.ty, this.fz, z),
			new Region(this.on, this.fx, this.tx, this.fy, this.ty, z, this.tz)];
	}

	split(b) {
		let r = this.splitX(b.fx);
		r = r.map(a => a.disjoint(b) ? a : a.splitX(b.tx)).flat();
		r = r.map(a => a.disjoint(b) ? a : a.splitY(b.fy)).flat();
		r = r.map(a => a.disjoint(b) ? a : a.splitY(b.ty)).flat();
		r = r.map(a => a.disjoint(b) ? a : a.splitZ(b.fz)).flat();
		r = r.map(a => a.disjoint(b) ? a : a.splitZ(b.tz)).flat();
		return r;
	}

	static fromArray(a) {
		return new Region(
			a[0] === "on",
			parseInt(a[1]),
			parseInt(a[2]) + 1,
			parseInt(a[3]),
			parseInt(a[4]) + 1,
			parseInt(a[5]),
			parseInt(a[6]) + 1
		);
	}
}

class Reactor {
	cubes = [];

	set(x, y, z, on) {
		if (x < -50 || x > 50) return;
		if (y < -50 || y > 50) return;
		if (z < -50 || z > 50) return;
		x += 50;
		y += 50;
		z += 50;
		if (this.cubes[x] === undefined) this.cubes[x] = [];
		if (this.cubes[x][y] === undefined) this.cubes[x][y] = [];
		this.cubes[x][y][z] = on;
	}

	count() {
		return this.cubes.flat(2).filter(c => c).length;
	}
}

export class S22a extends Solver {
	parseInput(input) {
		return input.split('\n')
			.map(l => /^(on|off) x=([-\d]+)\.\.([-\d]+),y=([-\d]+)\.\.([-\d]+),z=([-\d]+)\.\.([-\d]+)$/.exec(l).slice(1))
			.map(a => Region.fromArray(a));
	}

	calc(regions) {
		let r = new Reactor();
		regions.forEach(i => {
			let minX = Math.max(-50, i.fx), maxX = Math.min(51, i.tx);
			let minY = Math.max(-50, i.fy), maxY = Math.min(51, i.ty);
			let minZ = Math.max(-50, i.fz), maxZ = Math.min(51, i.tz);
			for (let x = minX; x < maxX; x++) {
				for (let y = minY; y < maxY; y++) {
					for (let z = minZ; z < maxZ; z++) {
						r.set(x, y, z, i.on);
					}
				}
			}
		});
		return r.count();
	}

	apply(reg, regions) {
		regions = regions.map(r => r.split(reg)).flat().filter(a => a.disjoint(reg));
		return reg.on ? regions.concat([reg]) : regions;
	}

	startReactor(regions, reactor, start, count) {
		let elapsed = Date.now() - start;
		reactor = this.apply(regions.pop(), reactor);
		let reactorCount = reactor.map(r => r.count()).reduce((a, b) => a + b, 0);
		this.setState({ solution: `Initialization Cubes: ${count}\nReactor Cubes: ${reactorCount}\nElapsed time: ${elapsed / 1000} s` });
		if (regions.length > 0)
			setTimeout(() => this.startReactor(regions, reactor, start, count), 1);
	}

	solve(input) {
		let test = "on x=-20..26,y=-36..17,z=-47..7\non x=-20..33,y=-21..23,z=-26..28\non x=-22..28,y=-29..23,z=-38..16\non x=-46..7,y=-6..46,z=-50..-1\non x=-49..1,y=-3..46,z=-24..28\non x=2..47,y=-22..22,z=-23..27\non x=-27..23,y=-28..26,z=-21..29\non x=-39..5,y=-6..47,z=-3..44\non x=-30..21,y=-8..43,z=-13..34\non x=-22..26,y=-27..20,z=-29..19\noff x=-48..-32,y=26..41,z=-47..-37\non x=-12..35,y=6..50,z=-50..-2\noff x=-48..-32,y=-32..-16,z=-15..-5\non x=-18..26,y=-33..15,z=-7..46\noff x=-40..-22,y=-38..-28,z=23..41\non x=-16..35,y=-41..10,z=-47..6\noff x=-32..-23,y=11..30,z=-14..3\non x=-49..-5,y=-3..45,z=-29..18\noff x=18..30,y=-20..-8,z=-3..13\non x=-41..9,y=-7..43,z=-33..15\non x=-54112..-39298,y=-85059..-49293,z=-27449..7877\non x=967..23432,y=45373..81175,z=27513..53682";
		this.assert(this.calc(this.parseInput(test)), 590784);
		let a = new Region(true, 10, 20, 10, 20, 10, 20);
		let b = new Region(true, 15, 25, 15, 25, 15, 25);
		let c = new Region(true, 15, 25, 5, 25, 5, 25);
		this.assert(a.split(b).length, 4);
		this.assert(a.split(c).length, 2);
		this.assert(this.apply(b, [a]).length, 4);
		let regions = this.parseInput(input).reverse();
		let count = this.calc(regions);
		let reactor = [];
		let start = Date.now();
		this.setState({ solution: `Initialization Cubes: ${count}\nReactor Cubes: 0\nElapsed time: 0 s` });
		setTimeout(() => this.startReactor(regions, reactor, start, count), 1);
	}
}

export class S22b extends Solver {
}