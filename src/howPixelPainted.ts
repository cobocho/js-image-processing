export const howPixelPainted = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d')!;

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	const data = imageData.data;

	return data;
};
