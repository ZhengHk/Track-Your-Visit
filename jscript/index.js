
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("signup_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

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