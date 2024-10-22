interface ImageData {
	src: string;
}

export const getImageFromSrc = ({
	src,
}: ImageData): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.src = src;
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			resolve(img);
		};
		img.onerror = reject;
	});
};

export const getOffset = (x: number, y: number, width: number) => {
	return (y * width + x) * 4;
};

export const averageGrayscale = (
	imageData: globalThis.ImageData,
	offset: number,
) => {
	const r = imageData.data[offset];
	const g = imageData.data[offset + 1];
	const b = imageData.data[offset + 2];
	const grayscale = (r + g + b) / 3;

	return grayscale;
};

export const luminanceGrayscale = (
	imageData: globalThis.ImageData,
	offset: number,
) => {
	const r = imageData.data[offset];
	const g = imageData.data[offset + 1];
	const b = imageData.data[offset + 2];

	return 0.3 * r + 0.587 * g + 0.114 * b;
};

export const brightness = (
	imageData: globalThis.ImageData,
	offset: number,
	amount: number = 1,
) => {
	const r = imageData.data[offset] * amount;
	const g = imageData.data[offset + 1] * amount;
	const b = imageData.data[offset + 2] * amount;

	return [r, g, b];
};

export const bright = (
	imageData: globalThis.ImageData,
	offset: number,
	amount: number = 1,
) => {
	const r = 255 * Math.pow(imageData.data[offset] / 255, amount);
	const g = 255 * Math.pow(imageData.data[offset + 1] / 255, amount);
	const b = 255 * Math.pow(imageData.data[offset + 2] / 255, amount);

	return [r, g, b];
};

export const contrast = (
	imageData: globalThis.ImageData,
	offset: number,
	amount: number = 1,
) => {
	const r = 255 * ((imageData.data[offset] / 255 - 0.5) * amount + 0.5);
	const g = 255 * ((imageData.data[offset + 1] / 255 - 0.5) * amount + 0.5);
	const b = 255 * ((imageData.data[offset + 2] / 255 - 0.5) * amount + 0.5);

	return [r, g, b];
};

export const saturation = (
	imageData: globalThis.ImageData,
	offset: number,
	amount: number = 1,
) => {
	const gray =
		(imageData.data[offset] +
			imageData.data[offset + 1] +
			imageData.data[offset + 2]) /
		3;
	const r = imageData.data[offset] * amount + gray * (1 - amount);
	const g = imageData.data[offset + 1] * amount + gray * (1 - amount);
	const b = imageData.data[offset + 2] * amount + gray * (1 - amount);

	return [r, g, b];
};

export const cloneCanvas = (oldCanvas: HTMLCanvasElement) => {
	const destCanvas = document.createElement('canvas');
	destCanvas.width = oldCanvas.width;
	destCanvas.height = oldCanvas.height;

	const destContext = destCanvas.getContext('2d')!;
	const destImageData = destContext.getImageData(
		0,
		0,
		oldCanvas.width,
		oldCanvas.height,
	);

	const oldContext = oldCanvas.getContext('2d')!;
	const oldImageData = oldContext.getImageData(
		0,
		0,
		oldCanvas.width,
		oldCanvas.height,
	);

	for (let y = 0; y < oldCanvas.height; y++) {
		for (let x = 0; x < oldCanvas.width; x++) {
			const offset = getOffset(x, y, oldCanvas.width);
			// const grayscaleValue = luminanceGrayscale(oldImageData, offset);
			const [r, g, b] = saturation(oldImageData, offset, 4);
			destImageData.data[offset] = r;
			destImageData.data[offset + 1] = g;
			destImageData.data[offset + 2] = b;
			destImageData.data[offset + 3] = oldImageData.data[offset + 3];
		}
	}

	destContext.putImageData(destImageData, 0, 0);

	return destCanvas;
};

export const getCanvasFromImage = async (image: HTMLImageElement) => {
	const canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;

	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(image, 0, 0);

	return canvas;
};

export const imageProcessing = async () => {
	const image = getImageFromSrc({
		src: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	});

	const canvas = await getCanvasFromImage(await image);
	console.time('cloneCanvas');
	const dest_canvas = cloneCanvas(canvas);
	console.timeEnd('cloneCanvas');

	document.body.appendChild(canvas);
	document.body.appendChild(dest_canvas);
};
