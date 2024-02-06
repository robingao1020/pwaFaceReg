const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
let ctx;
let videoWidth, videoHeight;
let model;

function displayLog(message) {
    const logContainer = document.getElementById('log');
    const logMessage = document.createElement('p');
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);
}

console.log = function () {
    for (let i = 0; i < arguments.length; i++) {
        displayLog(arguments[i]);
    }
};

async function setupCamera() {
    displayLog('Setting up camera...');
    const startTime = performance.now();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    const endTime = performance.now();
    displayLog(`Camera setup time: ${endTime - startTime} ms`);

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            videoWidth = video.videoWidth;
            videoHeight = video.videoHeight;
            video.width = videoWidth;
            video.height = videoHeight;
            resolve(video);
        };
    });
}

async function setupCanvas() {
    displayLog('Setting up canvas...');
    const startTime = performance.now();

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.fillStyle = "green";

    const endTime = performance.now();
    displayLog(`Canvas setup time: ${endTime - startTime} ms`);
}

async function loadFaceLandmarkDetectionModel() {
    displayLog('Loading face landmark detection model...');
    const startTime = performance.now();

    const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        { maxFaces: 1 }
    );

    const endTime = performance.now();
    displayLog(`Model loading time: ${endTime - startTime} ms`);

    return model;
}

async function renderPrediction() {
    const startTime = performance.now();

    const predictions = await model.estimateFaces({
        input: video,
        returnTensors: false,
        flipHorizontal: false,
        predictIrises: false
    });

    const endTime = performance.now();
    displayLog(`Prediction time: ${endTime - startTime} ms`);

    ctx.drawImage(
        video, 0, 0, video.width, video.height, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
        predictions.forEach(prediction => {
            const keypoints = prediction.scaledMesh;
            for (let i = 0; i < keypoints.length; i++) {
                const x = keypoints[i][0];
                const y = keypoints[i][1];

                ctx.beginPath();
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }

    window.requestAnimationFrame(renderPrediction);
}

async function main() {
    displayLog('Initializing...');

    try {
        await setupCamera();
        await setupCanvas();
        model = await loadFaceLandmarkDetectionModel();
        renderPrediction();
    } catch (error) {
        displayLog(`Error during initialization: ${error.message}`);
    }
}

main();
