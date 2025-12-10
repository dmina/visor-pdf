// --- Configuración PDF.js ---
pdfjsLib.GlobalWorkerOptions.workerSrc = "libs/pdfjs/pdf.worker.js";

let pdfDoc = null;
let page = null;
let scale = 1;

const pdfCanvas = document.getElementById("pdf-canvas");
const pdfCtx = pdfCanvas.getContext("2d");

const overlay = document.getElementById("overlay");
const oCtx = overlay.getContext("2d");

const viewer = document.getElementById("viewer-container");


// --------------------------------------
// 1. Cargar el PDF
// --------------------------------------
pdfjsLib.getDocument("plano.pdf").promise.then(doc => {
    pdfDoc = doc;
    return doc.getPage(1);
})
.then(p => {
    page = p;
    renderPDF();
});


// --------------------------------------
// 2. Renderizado del PDF
// --------------------------------------
function renderPDF() {
    const viewport = page.getViewport({ scale });

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    overlay.width = viewport.width;
    overlay.height = viewport.height;

    page.render({
        canvasContext: pdfCtx,
        viewport
    });
}


// --------------------------------------
// 3. Controles de zoom
// --------------------------------------
document.getElementById("zoom-in").onclick = () => {
    scale += 0.10;
    renderPDF();
};

document.getElementById("zoom-out").onclick = () => {
    if (scale > 0.20) {
        scale -= 0.10;
        renderPDF();
    }
};


// --------------------------------------
// 4. Dibujar medidas en el overlay
// --------------------------------------
let startPoint = null;

overlay.addEventListener("mousedown", e => {
    const rect = overlay.getBoundingClientRect();
    startPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
});

overlay.addEventListener("mouseup", e => {
    if (!startPoint) return;

    const rect = overlay.getBoundingClientRect();
    const endPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    // Dibujar la línea
    oCtx.strokeStyle = "red";
    oCtx.lineWidth = 2;
    oCtx.beginPath();
    oCtx.moveTo(startPoint.x, startPoint.y);
    oCtx.lineTo(endPoint.x, endPoint.y);
    oCtx.stroke();

    // Calcular distancia en pixeles
    const dist = Math.sqrt(
        (endPoint.x - startPoint.x)**2 +
        (endPoint.y - startPoint.y)**2
    ).toFixed(1);

    // Mostrar texto
    oCtx.fillStyle = "red";
    oCtx.font = "16px Arial";
    oCtx.fillText(dist + " px", (startPoint.x + endPoint.x)/2, (startPoint.y + endPoint.y)/2);

    startPoint = null;
});


// --------------------------------------
// 5. Borrar overlay
// --------------------------------------
document.getElementById("clear").onclick = () => {
    oCtx.clearRect(0, 0, overlay.width, overlay.height);
};
