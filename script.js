const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
let originalImage = null;

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function applyFilter(filter) {
    if (!originalImage) return;
    ctx.putImageData(originalImage, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filter) {
        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
            break;
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                data[i] = r * 0.393 + g * 0.769 + b * 0.189;
                data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
                data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
            }
            break;
        case 'invert':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            break;
        case 'brightness':
            for (let i = 0; i < data.length; i += 4) {
                data[i] += 40;
                data[i + 1] += 40;
                data[i + 2] += 40;
            }
            break;
        case 'contrast':
            const contrastFactor = (259 * (128 + 255)) / (255 * (259 - 128));
            for (let i = 0; i < data.length; i += 4) {
                data[i] = contrastFactor * (data[i] - 128) + 128;
                data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128;
                data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128;
            }
            break;
    }
    ctx.putImageData(imageData, 0, 0);
}

function resetImage() {
    if (originalImage) {
        ctx.putImageData(originalImage, 0, 0);
    }
}

function saveImage() {
    const dataUrl = canvas.toDataURL(); // Converte o conteúdo do canvas em um URL de imagem
    const a = document.createElement('a'); // Cria um link
    a.href = dataUrl;
    a.download = 'imagem_editada.png'; // Nome do arquivo
    a.click(); // Simula o clique para iniciar o download
}
