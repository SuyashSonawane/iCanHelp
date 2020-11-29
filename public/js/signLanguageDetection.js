let model;
let cam, img;
let video;
let out = document.getElementById("data")

let button = document.getElementById("op-btn")
let isStarted = false;
button.addEventListener("click", () => {
    console.log("123")
    isStarted = !isStarted

    if (isStarted) {
        button.innerHTML = "Stop"
        button.style.background = "#ed341d"
    }
    else {
        button.innerHTML = "Start"
        button.style.background = "green"
    }

    capture()

})

var alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
const load = async () => {
    model = await tf.loadLayersModel('/js/model.json')
    console.log(model)

    video = document.querySelector("#videoElement");

    video.addEventListener("loadeddata", capture)

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!");
            });
    }



}

async function capture() {

    if (isStarted) {
        tf.tidy(() => {
            img = tf.browser.fromPixels(video).resizeBilinear([28, 28])
            grayscale_image = img.mean(2)
            img = grayscale_image.expandDims(2)
            img = tf.expandDims(img, 0)
            let preds = model.predict(img).dataSync()
            out.innerHTML = alphabet[tf.argMax(preds).dataSync()[0]]

        })
        requestAnimationFrame(capture)
    }
}

load()