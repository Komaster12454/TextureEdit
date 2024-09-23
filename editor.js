// Canvas setup
const canvas = document.getElementById('textureCanvas');
const ctx = canvas.getContext('2d');
const uploadedImage = document.getElementById('uploadedImage');
let drawing = false;
let lastX = 0;
let lastY = 0;

// Handling image upload
document.getElementById('uploadTexture').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            uploadedImage.src = canvas.toDataURL();
            uploadedImage.style.display = 'block';
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

// Drawing tool
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

// Save Texture with selected type (Normal, Height, Original)
document.getElementById('saveTexture').addEventListener('click', function() {
    const type = prompt('Enter texture type (normal, height, original):').toLowerCase();
    if (type === 'normal' || type === 'height' || type === 'original') {
        generateAndSaveTexture(type);
    } else {
        alert('Invalid texture type.');
    }
});

function generateAndSaveTexture(type) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    if (type === 'normal') {
        const normalMapData = createNormalMap(data, width, height);
        ctx.putImageData(new ImageData(normalMapData, width, height), 0, 0);
    } else if (type === 'height') {
        const heightMapData = createHeightMap(data, width, height);
        ctx.putImageData(new ImageData(heightMapData, width, height), 0, 0);
    }

    const link = document.createElement('a');
    link.download = `edited_texture_${type}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function createNormalMap(data, width, height) {
    const normalMap = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;

            const hL = getHeight(data, width, x - 1, y);
            const hR = getHeight(data, width, x + 1, y);
            const hD = getHeight(data, width, x, y - 1);
            const hU = getHeight(data, width, x, y + 1);

            const dX = hR - hL;
            const dY = hU - hD;

            const nX = (dX + 1) * 0.5 * 255;
            const nY = (dY + 1) * 0.5 * 255;
            const nZ = Math.sqrt(1 - (dX * dX + dY * dY)) * 255;

            normalMap[i] = nX;
            normalMap[i + 1] = nY;
            normalMap[i + 2] = nZ;
            normalMap[i + 3] = 255; // alpha channel
        }
    }

    return normalMap;
}

function createHeightMap(data, width, height) {
    const heightMap = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            heightMap[i] = avg;
            heightMap[i + 1] = avg;
            heightMap[i + 2] = avg;
            heightMap[i + 3] = 255; // alpha channel
        }
    }

    return heightMap;
}

function getHeight(data, width, x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
        return 0; // Out of bounds, assume height of 0
    }
    const i = (y * width + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
}
