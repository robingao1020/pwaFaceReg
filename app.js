// app.js

function displayLog(message) {
    const logContainer = document.getElementById('log');
    const logMessage = document.createElement('p');
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);
}

// Override console.log to also display logs in the #log div
console.log = function() {
    for (let i = 0; i < arguments.length; i++) {
        displayLog(arguments[i]);
    }
};

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
    const ctx = overlay.getContext('2d');

    async function renderPrediction() {
        try {
            const faces = await detector.estimateFaces({
                input: video,
                returnTensors: false,
                flipHorizontal: false,
                predictIrises: false
            });

            // 清除整个 canvas
            ctx.clearRect(0, 0, overlay.width, overlay.height);

            // 绘制图像
            ctx.drawImage(
                video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, overlay.width, overlay.height);

            if (faces.length > 0) {
                displayLog('Detected faces:', faces);
                faces.forEach(face => {
                    const keypoints = face.scaledMesh;
                    for (let i = 0; i < keypoints.length; i++) {
                        const [x, y, z] = keypoints[i];
                    
                        // 绘制颜色点
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, 2 * Math.PI);
                        ctx.fillStyle = 'rgba(255, 0, 0, 1)'; // Red color with alpha channel
                        ctx.fill();
                    }
                });
            } else {
                displayLog('No faces detected.');
            }

            // 请求下一帧动画
            requestAnimationFrame(renderPrediction);
        } catch (error) {
            displayLog(`Error detecting face landmarks: ${error.message}`);
        }
    }

    // 开始渲染循环
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
