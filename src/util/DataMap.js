import React, { useRef, useEffect } from "react";

export const DataMap = props => {
	const canvasRef = useRef(null);
	let { data, scale, stylemap, ...p } = props;
	data = data || [];
	scale = scale || 1;
	stylemap = stylemap || (b => b ? "#FFFFFF" : "#000000");
	const height = data.length * scale;
	const width = Math.max(...data.map(l => l.length)) * scale;
	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d');
		for (let y = 0; y < data.length; y++) {
			for (let x = 0; x < data[y].length; x++) {
				context.fillStyle = stylemap(data[y][x]);
				context.fillRect(x * scale, y * scale, (x + 1) * scale, (y + 1) * scale);
			}
		}
	});
	return <canvas ref={canvasRef} width={width} height={height} {...p} />
}