
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

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


//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
	console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
		audioContext = new AudioContext();


		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
	rec.exportWAV(uploadToStorage);
}

function createDownloadLink(blob) {
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');

	//name of .wav file to use during upload and download (without extendion)
	dateNow = new Date().toString() 
	const filename = dateNow.replace("GMT+0530 (India Standard Time)", "");

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;


	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(filename))

	//add the save to disk link to li
	//add the li element to the ol
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
		//const name = +new Date() + "-" + file.name;
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
			method: 'POST', // or 'PUT'
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

