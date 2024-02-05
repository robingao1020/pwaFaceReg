document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const overlay = document.getElementById('overlay');
    const captureButton = document.getElementById('capture-button');
    
    let stream;
    let photo;

    captureButton.addEventListener('click', () => {
        takePhoto();
    });

    async function initCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                setupCanvas();
                detectFace();
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }

    function setupCanvas() {
        const canvas = faceapi.createCanvasFromMedia(video);
        overlay.appendChild(canvas);
    }

    async function detectFace() {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const canvas = faceapi.selectCanvas(overlay);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceLandmarks(canvas, detections);

        // Continue detecting in the next frame
        requestAnimationFrame(() => detectFace());
    }

    function takePhoto() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        photo = canvas.toDataURL('image/png');

        // You can do something with the captured photo, like sending it to a server for face recognition.
        console.log('Photo captured:', photo);
    }

    initCamera();
});
