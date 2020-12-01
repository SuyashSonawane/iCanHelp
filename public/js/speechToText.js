let btn = document.getElementById("btn")
let data = ""
function runSpeechRecognition() {
    // get output div reference
    btn.style.background = "#ed341d"
    var output = document.getElementById("output");
    // get action element reference
    var action = document.getElementById("action");
    // new speech recognition object
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // This runs when the speech recognition service starts
    recognition.onstart = function () {
        action.innerHTML = "<small>listening, please speak...</small>";
    };

    recognition.onspeechend = function () {
        action.innerHTML = "<small>stopped listening, hope you are done...</small>";
        btn.style.background = "#4CAF50"
        recognition.stop();
    }

    // This runs when the speech recognition service returns result
    recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        data = "<br><b>Text:</b> " + transcript + "<br/> <b>Confidence:</b> " + confidence * 100 + "%<br><br>" + data
        output.innerHTML = data;

        output.classList.remove("hide");
    };

    // start recognition
    recognition.start()
}