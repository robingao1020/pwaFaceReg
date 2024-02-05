// main.js
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const constraints = { video: true };

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            startVideo();
        });
    })
    .catch((err) => {
        console.error(err);
    });

function startVideo() {
    video.addEventListener('play', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;
        document.body.append(canvas);

        const context = canvas.getContext('2d');

        const render = async () => {
            context.drawImage(video, 0, 0, video.width, video.height);
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

            context.clearRect(0, 0, canvas.width, canvas.height);
            for (const detection of detections) {
                const box = detection.box;
                context.strokeStyle = '#00FF00';
                context.lineWidth = 2;
                context.strokeRect(box.x, box.y, box.width, box.height);
            }

            requestAnimationFrame(render);
        };

        render();
    });
}
