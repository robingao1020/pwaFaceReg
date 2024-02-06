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

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;

        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                displayLog('Camera setup complete');
                resolve(video);
            };
        });
    } catch (error) {
        displayLog(`Error setting up camera: ${error.message}`);
    }
}

async function loadFaceLandmarksModel() {
    displayLog('Loading face landmarks model...');

    try {
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        };
        return faceLandmarksDetection.createDetector(model, detectorConfig);
    } catch (error) {
        displayLog(`Error loading face landmarks model: ${error.message}`);
    }
}

async function detectFaceLandmarks(video, detector) {
    const overlay = document.getElementById('overlay');
    const canvas = overlay.getContext('2d');

    async function renderPrediction() {
        try {
            const faces = await detector.estimateFaces(video);

            if (faces.length > 0) {
                displayLog('Detected faces:', faces);
            } else {
                displayLog('No faces detected.');
            }

            canvas.clearRect(0, 0, video.width, video.height);

            for (const face of faces) {
<<<<<<< HEAD
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
                    canvas.fillRect(x - 2, y - 2, 4, 4); // Draw a small rectangle around each keypoint
                }
=======
                // ... 绘制人脸框和关键点的逻辑 ...
>>>>>>> 1010823c50e2b00d6de8df6e2d18e8a4857ae08f
            }

            // Request the next animation frame
            requestAnimationFrame(renderPrediction);
        } catch (error) {
            displayLog(`Error detecting face landmarks: ${error.message}`);
        }
    }

    // Start the rendering loop
    displayLog('Rendering loop started');
    renderPrediction();
}

async function run() {
    displayLog('Initializing...');

    try {
        const video = await setupCamera();
        const detector = await loadFaceLandmarksModel();

        if (video && detector) {
            detectFaceLandmarks(video, detector);
        } else {
            displayLog('Failed to initialize camera or face landmarks model.');
        }
    } catch (error) {
        displayLog(`Error during initialization: ${error.message}`);
    }
}

run();
