export function readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

export async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    const dataUrl = await readAsDataURL(file);

    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
            let { width, height } = img;
            const ratio = Math.min(1, maxWidth / width, maxHeight / height);
            if (ratio < 1) {
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(dataUrl);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL(file.type || "image/png", 0.9));
        };
        img.onerror = () => reject(new Error("Failed to load image for resizing"));
        img.src = dataUrl;
    });
}