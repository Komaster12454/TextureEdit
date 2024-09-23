// Upload and display image on the canvas
document.getElementById('uploadTexture').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgElement = document.getElementById('uploadedImage');
            const canvas = document.getElementById('textureCanvas');
            const ctx = canvas.getContext('2d');
            imgElement.src = event.target.result;
            imgElement.onload = function () {
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                ctx.drawImage(imgElement, 0, 0);
                imgElement.style.display = 'none';
                canvas.style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }
});

// Draw tool
document.getElementById('drawTool').addEventListener('click', function () {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', function () {
        drawing = true;
        ctx.beginPath();
    });

    canvas.addEventListener('mousemove', function (e) {
        if (drawing) {
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#00ccff';
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', function () {
        drawing = false;
        ctx.closePath();
    });
});

// Color Picker tool
document.getElementById('colorPickerTool').addEventListener('click', function () {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');

    canvas.addEventListener('click', function (e) {
        const pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        alert(`Picked color: ${rgb}`);
    });
});

// Brightness Adjustment tool
document.getElementById('brightnessTool').addEventListener('click', function () {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] += 20;     // Red
        data[i + 1] += 20; // Green
        data[i + 2] += 20; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
});

// Contrast Adjustment tool
document.getElementById('contrastTool').addEventListener('click', function () {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let factor = (259 * (128 + 100)) / (255 * (259 - 100)); // Factor for contrast adjustment

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;     // Red
        data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
        data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
});

// Blur tool
document.getElementById('blurTool').addEventListener('click', function () {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');

    ctx.filter = 'blur(5px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
});

// Invert Colors tool
document.getElementById('invertTool').addEventListener('click', function () {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
});

// Save Texture functionality
document.getElementById('saveTexture').addEventListener('click', function () {
    const canvas = document.getElementById('textureCanvas');
    const link = document.createElement('a');
    link.download = 'texture.png';
    link.href = canvas.toDataURL();
    link.click();
});
