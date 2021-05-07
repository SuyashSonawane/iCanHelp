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
    let data = canvas.toDataURL()
    video.style.display = "none"
    document.querySelector(".loader").style.display = "block"
    button.disabled = true
    //POST request with body equal on data in JSON format
    var myHeaders = new Headers();
    myHeaders.append("apikey", "dfa039fec188957");

    var formdata = new FormData();
    formdata.append("language", "eng");
    formdata.append("isOverlayRequired", "false");
    formdata.append("iscreatesearchablepdf", "false");
    formdata.append("issearchablepdfhidetextlayer", "false");
    formdata.append("base64Image", data)

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch("https://api.ocr.space/parse/image", requestOptions)
        .then(response => response.json())
        .then(result => {
            showResults(result)
            // console.log(result)
        })
        .catch(error => console.log('error', error));

    // fetch('http://localhost:5000/api', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ data: data }),
    // })
    //     .then((response) => response.json())
    //     //Then with the data from the response in JSON...
    //     .then((data) => {

    //         showResults(data)

    //     })
    //     //Then with the error genereted...
    //     .catch((error) => {
    //         console.error('Error:', error);
    //     });

    // requestAnimationFrame(convert)
}

function showResults(data) {

    document.querySelector(".loader").style.display = "none"
    button.disabled = false;
    button.innerText = "New Image"
    video.style.display = "block"

    console.log('Success:', data);
    if (!data.IsErroredOnProcessing) {
        document.getElementById("printresult").innerHTML = data.ParsedResults[0].ParsedText
        Sdata = data.ParsedResults[0].ParsedText
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