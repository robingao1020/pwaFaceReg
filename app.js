// app.js

function displayLog(message) {
    const logContainer = document.getElementById('log');
    const logMessage = document.createElement('p');
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);
}

async function setupCamera() {
    displayLog('Setting up camera...');
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            displayLog('Camera setup complete');
            resolve(video);
        };
    });
}

async function loadFaceLandmarksModel() {
    displayLog('Loading face landmarks model...');
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    };
    return faceLandmarksDetection.createDetector(model, detectorConfig);
}

async function detectFaceLandmarks(video, detector) {
    const overlay = document.getElementById('overlay');
    const canvas = overlay.getContext('2d');

    async function renderPrediction() {
        const faces = await detector.estimateFaces(video);

        canvas.clearRect(0, 0, video.width, video.height);

        for (const face of faces) {
            const boundingBox = face.box;
            const keypoints = face.scaledMesh;

            // Draw bounding box
            canvas.strokeStyle = '#00FF00';
            canvas.lineWidth = 2;
            canvas.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

            // Draw keypoints
            for (const point of keypoints) {
                const [x, y] = point;
                canvas.fillStyle = '#00FF00';
                canvas.fillRect(x, y, 2, 2);
            }
        }

        // Request the next animation frame
        requestAnimationFrame(renderPrediction);
    }

    // Start the rendering loop
    displayLog('Rendering loop started');
    renderPrediction();
}

async function run() {
    displayLog('Initializing...');
    const video = await setupCamera();
    const detector = await loadFaceLandmarksModel();

    detectFaceLandmarks(video, detector);
}

run();
