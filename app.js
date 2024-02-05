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
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
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
