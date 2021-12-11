export { CssImage } from './CssImage';
export { ValueGrid } from './ValueGrid';
export { Computer } from './IntCode';
export { DataMap } from './DataMap';
export { drawCircle, drawFilledCircle, drawLine, drawFilledRect } from './Drawing';

export function pad(s, len, padChar) {
	while (s.length < len) { s = padChar + s; }
	return s;
}

export function reverseArray(a) {
	return [].concat(a).reverse();
}