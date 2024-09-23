// Load uploaded texture onto the canvas
document.getElementById('uploadTexture').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.getElementById('textureCanvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Add animation to canvasWrapper
                document.getElementById('canvasWrapper').classList.add('active');
            }
        };
        reader.readAsDataURL(file);
    }
});

// Apply filter to the texture
document.getElementById('applyFilter').addEventListener('click', () => {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');
    
    // Example: Apply a simple grayscale filter
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);

    // Add a subtle flash animation to indicate filter applied
    document.getElementById('textureCanvas').classList.add('flash');
    setTimeout(() => {
        document.getElementById('textureCanvas').classList.remove('flash');
    }, 300);
});

// Save the edited texture
document.getElementById('saveTexture').addEventListener('click', () => {
    const canvas = document.getElementById('textureCanvas');
    const link = document.createElement('a');
    link.download = 'edited_texture.png';
    link.href = canvas.toDataURL();
    link.click();
});
