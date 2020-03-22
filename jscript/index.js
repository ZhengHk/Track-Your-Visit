
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("signup_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      //document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
      qrCodeGen();
    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("signup_div").style.display = "none";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  console.log("test");

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}

function goToSignup() {
  document.getElementById("user_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("signup_div").style.display = "block";
}

function signup() {
  var email = document.getElementById("signup_email_field").value;
  var pass1 = document.getElementById("signup_password_field").value;
  var first = document.getElementById("first_name").value;
  var name = document.getElementById("last_name").value;
  var pass2 = document.getElementById("repeat_password_field").value;
  var stname = document.getElementById("store_name").value;
  var adr = document.getElementById("adress").value;

  if(pass1 !== pass2){
    window.alert("Die Passwoerter muessen uebereinstimmen!");
  }
  else{
    firebase.auth().createUserWithEmailAndPassword(email, pass1).then(function (result) {
      var user = firebase.auth().currentUser;

      if(user != null){

        var user_id = user.uid;
        writeUserData(null, email, user_id, name, null, first);
        writeStoreData(adr, stname);
      }
      else{
        window.alert("Ihre Daten konnten nicht gespeichert werden. Bitte ueberpruefen sie diese in ihrem Akkount!")
      }


    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      window.alert("Error : " + errorMessage);
    });
  }

}

function writeUserData(adr, mail, userId, name, tele, vorn) {
  const db = firebase.firestore();
  db.collection("users").doc(userId).set({
    adresse: adr,
    email: mail,
    id: userId,
    nachname: name,
    telefon: tele,
    vorname: vorn
  });

}

function writeStoreData(adr, n) {
  const db = firebase.firestore();
  db.collection("stores").add({
    adresse: adr,
    name: n
  })
}

function qrCodeGen() {
  const db = firebase.firestore();

  var user = firebase.auth().currentUser;
  if (user != null) {
    const uid = user.uid;
    const userRef = db.collection("users").doc(uid + "");

    userRef.get().then(function(doc) {
      user = doc.data();
      showQrCode(user);
    }).catch(function(error) {
      console.log(error);
    });
  } else {
    alert("Sitzung ist ungültig!");
    showQrCode({
      vorname: "Max",
      nachname: "Mustermann",
      email: "max.mustermann@gmail.com",
      telefon: "+49123456789",
      storeId: "123456789"
    });
  }
}

function showQrCode(user) {
  document.getElementById("user_greeting").innerText = "Hallo " + user.vorname + "!";
  document.getElementById("vorn").innerText = "Vorname: "+user.vorname;
  document.getElementById("nachn").innerText = "Nachname: "+user.nachname;
  document.getElementById("em").innerText = "Email: "+user.email;
  document.getElementById("tele").innerText = "Telefon: "+user.telefon;

  //document.getElementById("sadr").innerText = ""+;
  //document.getElementById("").innerText = ""+;

  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + user.storeId;
  document.getElementById("qr_code").setAttribute("src", qrUrl);

  // <a id="download" href="a.jpg" download="a.jpg">Download</a>
  var downloadButton = document.createElement("a");
  downloadButton.setAttribute("href", "qrUrl");
  downloadButton.setAttribute("download", qrUrl);
  downloadButton.innerHTML = "QR-Code herunterladen";
  document.getElementById("qr_code_download").append(downloadButton);
}

function showStoreData(store) {
  document.getElementById("sadr").innerText = "Laden-Adresse: "+store.adresse;
  document.getElementById("sn").innerText = "Laden-Name: "+store.name;
}