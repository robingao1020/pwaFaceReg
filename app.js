document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('video');
    const overlay = document.getElementById('overlay');
    const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        video.addEventListener('loadeddata', () => {
            setInterval(async () => {
                const predictions = await model.estimateFaces({
                    input: video
                });

                if (predictions.length > 0) {
                    const face = predictions[0].scaledMesh;

                    // Clear previous drawings
                    overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);

                    // Draw face landmarks
                    drawFaceLandmarks(face, overlay);
                }
            }, 100);
        });
    }
});

function drawFaceLandmarks(face, canvas) {
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    for (let i = 0; i < face.length; i++) {
        const x = face[i][0];
        const y = face[i][1];

        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
    }
    ctx.closePath();
}
