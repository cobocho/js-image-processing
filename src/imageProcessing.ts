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
			for (let i = 0; i < 4; i++) {
				destImageData.data[offset + i] = oldImageData.data[offset + i];
			}
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
