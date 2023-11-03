import html2canvas from 'html2canvas';

export default function downloadImage() {
    const nodeToCapture = document.getElementById('chartContainer');
    html2canvas(nodeToCapture).then(function (canvas) {
        const imageUrl = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = imageUrl;
        downloadLink.download = "screenshot.png";
        downloadLink.click();
    });
}