import type { Marker } from "src/types";

export const markerTransform = ({ x, y }: Marker["position"], size: number) => {
	return `translate(${x - size / 2}px, ${y - size / 2}px)`;
};

export const markerRGBAString = ({ r, g, b, a }: Marker["color"]) => {
	return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const positionWithinWindowBounds = (
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number | undefined = 20
) => {
	const minX = padding;
	const maxX = window.innerWidth - padding;
	const minY = padding;
	const maxY = window.innerHeight - padding;

	if (x < minX) x = minX;
	if (y < minY) y = minY;
	if (x + width > maxX) x = maxX - width;
	if (y + height > maxY) y = maxY - height;

	return { x, y };
};

export const getPointerPosition = (
	bbox: DOMRect,
	x: number,
	y: number
): { x: number; y: number } => {
	x = x - bbox.x;
	y = y - bbox.y;

	if (x < 0) x = 0;
	if (y < 0) y = 0;
	if (x > bbox.width) x = bbox.width;
	if (y > bbox.height) y = bbox.height;

	return { x, y };
};

// Source: https://zellwk.com/blog/keyboard-focusable-elements/
export const getFocusableElements = (elem: HTMLElement): HTMLElement[] => {
	const nodes: NodeListOf<HTMLElement> = elem.querySelectorAll(
		'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
	);

	return Array.from(nodes).filter((el) => !el.hasAttribute("disabled"));
};
