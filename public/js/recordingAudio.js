
URL = window.URL || window.webkitURL;

var gumStream; 						
var rec; 							
var input; 							
 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext 

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

var firebaseConfig = {
	apiKey: "AIzaSyBwJ-gbKQZBQ6TkDhxYB-uWwfOOMkZBm_Q",
	authDomain: "campusmate-v1.firebaseapp.com",
	databaseURL: "https://campusmate-v1.firebaseio.com",
	projectId: "campusmate-v1",
	storageBucket: "campusmate-v1.appspot.com",
	messagingSenderId: "130311153720",
	appId: "1:130311153720:web:4974d7492c98721fccdecd",
	measurementId: "G-SVBT8QZPQN"
  };
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	console.log(firebase);


recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
	console.log("recordButton clicked");
    var constraints = { audio: true, video:false }
	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		audioContext = new AudioContext();

		gumStream = stream;
		
		input = audioContext.createMediaStreamSource(stream);

		rec = new Recorder(input,{numChannels:1})

		rec.record()

		console.log("Recording started");

	}).catch(function(err) {

    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){

		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{

		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	pauseButton.innerHTML="Pause";

	rec.stop();

	gumStream.getAudioTracks()[0].stop();

	rec.exportWAV(createDownloadLink);
	rec.exportWAV(uploadToStorage);
}

function createDownloadLink(blob) {
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');

	dateNow = new Date().toString() 
	const filename = dateNow.replace("GMT+0530 (India Standard Time)", "");

	au.controls = true;
	au.src = url;

	li.appendChild(au);

	li.appendChild(document.createTextNode(filename))

	recordingsList.appendChild(li);
}

uploadToStorage = (blob) => {
	
	var url = URL.createObjectURL(blob);
	console.log(url)

	var div = document.getElementById("uploading")
	div.innerHTML = "Uploading audio to database...."

	getFileBlob(url, blobs =>{
		recordButton.disabled = true
		pauseButton.disabled = true
		stopButton.disabled = true

		const ref = firebase.storage().ref();
		const file = blobs

		dateNow = new Date().toString() 
		const name = dateNow.replace("GMT+0530 (India Standard Time)", "");
		const task = ref.child(name).put(file);
		task
		  .then(snapshot => snapshot.ref.getDownloadURL())
		  .then(url=> {
			console.log(url);
			dateNow = new Date().toString() 
			const name = dateNow.replace("GMT+0530 (India Standard Time)", "");
			console.log(name)
			fetch('/voiceNotes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify([{"voiceNoteLink": url,
								   "voiceNoteName": name}
								])
			})

			recordButton.disabled = false
			pauseButton.disabled = true
			stopButton.disabled = true
			div.innerHTML = " "
		  })

		  .catch(console.error);
	})


}

var getFileBlob = function (url, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.addEventListener('load', function() {
	  cb(xhr.response);
	});
	xhr.send();
  };

