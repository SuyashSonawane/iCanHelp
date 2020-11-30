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

    function uploadImage() {
      const ref = firebase.storage().ref();
      const file = document.querySelector("#photo").files[0];
      //const name = +new Date() + "-" + file.name;
      const name = file.name;
      const metadata = {
        contentType: file.type
      };
      const task = ref.child(name).put(file, metadata);
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          console.log(url);
          fetch('/updateProfile/photo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({"profilePhoto": url})
			})
        setTimeout(function(){window.location.reload()}, 1500);
      })
        .catch(console.error);
    }
