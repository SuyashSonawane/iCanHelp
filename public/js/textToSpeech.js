video = document.querySelector("#videoElement");

let button = document.getElementById("cap-btn")
let speakBtn = document.getElementById("speak")
let canvas = document.getElementById('canvas');

let Sdata;

// video.addEventListener("loadeddata", convert)

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.log("Something went wrong!");
        });
}

function convert() {
    speakBtn.style.display = "none"

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    let data = canvas.toDataURL().split(",")[1]
    video.style.display = "none"
    document.querySelector(".loader").style.display = "block"
    button.disabled = true
    //POST request with body equal on data in JSON format
    fetch('http://localhost:5000/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data }),
    })
        .then((response) => response.json())
        //Then with the data from the response in JSON...
        .then((data) => {

            showResults(data)

        })
        //Then with the error genereted...
        .catch((error) => {
            console.error('Error:', error);
        });

    // requestAnimationFrame(convert)
}

function showResults(data) {

    document.querySelector(".loader").style.display = "none"
    button.disabled = false;
    button.innerText = "New Image"
    video.style.display = "block"

    console.log('Success:', data);
    if (data.trim().length > 0) {
        document.getElementById("printresult").innerHTML = data
        Sdata = data
        speakBtn.style.display = "initial"
    }
    else
        document.getElementById("printresult").innerHTML = "Cannot read text"
}

function speak() {
    if (Sdata) {
        let msg = new SpeechSynthesisUtterance(`${Sdata}`);
        window.speechSynthesis.speak(msg);

    }
}