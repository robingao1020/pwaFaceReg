// main.js
const webcam = document.getElementById('webcam');
const constraints = { video: true };

navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => { webcam.srcObject = stream; })
  .catch((err) => { console.error(err); });

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models')
]).then(startVideo);

function startVideo() {
  webcam.addEventListener('play', () => {
    const canvas = document.createElement('canvas');
    canvas.width = webcam.width;
    canvas.height = webcam.height;
    document.body.append(canvas);

    const context = canvas.getContext('2d');

    const render = async () => {
      context.drawImage(webcam, 0, 0, webcam.width, webcam.height);
      const detections = await faceapi.detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions());
      
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
