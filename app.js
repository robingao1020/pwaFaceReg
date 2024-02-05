// app.js
async function setupCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ 'video': {} });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadFaceLandmarksModel() {
    return faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );
}

function detectFaceLandmarks(video, model) {
    const overlay = document.getElementById('overlay');
    const canvas = overlay.getContext('2d');

    async function renderPrediction() {
        const predictions = await model.estimateFaces({
            input: video
        });

        canvas.clearRect(0, 0, video.width, video.height);

        if (predictions.length > 0) {
            const keypoints = predictions[0].scaledMesh;

            for (let i = 0; i < keypoints.length; i++) {
                const [x, y] = keypoints[i];
                canvas.fillStyle = '#00FF00';
                canvas.fillRect(x, y, 2, 2);
            }
        }

        requestAnimationFrame(renderPrediction);
    }

    renderPrediction();
}

async function run() {
    const video = await setupCamera();
    const model = await loadFaceLandmarksModel();

    detectFaceLandmarks(video, model);
}

run();
