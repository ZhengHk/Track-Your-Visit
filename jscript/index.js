
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
        writeStoreDataToUser(adr, stname, user_id);
        console.log(user_id);


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

function writeStoreDataToUser(adr, n, user_id) {
  const db = firebase.firestore();
  db.collection("stores").add({
    adresse: adr,
    name: n
  }).then(function (result) {
    console.log(result.id)
    db.collection("users").doc(""+user_id).update({
      storeId: result.id
    }).then(function (res) {
      console.log(res.storeId);
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      window.alert("Error : " + errorMessage);
    });
  })
}

function writeStoreData(adr, n) {
  const db = firebase.firestore();
  db.collection("stores").add({
    adresse: adr,
    name: n
  }).then(function (result) {
      console.log(result.id)
      return result.id;
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
      showStoreInfo(db, user);
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
    showStoreInfo2({
      adresse: "Mustermannstraße 1",
      name: "Musterladen"
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
  downloadButton.setAttribute("href", qrUrl.replace("size=150x150", "size=1000x1000"));
  downloadButton.innerHTML = "QR-Code in 1000x1000";
  document.getElementById("qr_code_download").append(downloadButton);
}

function showStoreInfo(db, user) {
  db.collection("stores").doc(user.storeId).get().then(function(doc) {
    var store = doc.data();
    console.log(store.adresse);
    console.log(store.name);
    showStoreInfo2(store);
  }).catch(function(error) {
    console.log(error);
  });
}

function showStoreInfo2(store) {
  document.getElementById("sadr").innerText = "Adresse: "+store.adresse;
  document.getElementById("sn").innerText = "Laden-Name: "+store.name;
}

function showStoreData(store) {
  document.getElementById("sadr").innerText = "Laden-Adresse: "+store.adresse;
  document.getElementById("sn").innerText = "Laden-Name: "+store.name;
}

function update() {
  const email = document.getElementById("signup_email_field1").value;
  const first = document.getElementById("first_name1").value;
  const name = document.getElementById("last_name1").value;
  const tele = document.getElementById("telefon_field").value;
  const stname = document.getElementById("store_name1").value;
  const adr = document.getElementById("adress1").value;

  var fbUser = firebase.auth().currentUser;
  const db = firebase.firestore();
  const uid = fbUser.uid;
  const userRef = db.collection("users").doc(uid + "");

  userRef.get().then(function(doc) {
    const user = doc.data();
    if (user != null) {
      if(email !== ""){
        db.collection("users").doc(""+uid).update({
          email: email
        });
        document.getElementById("signup_email_field1").value = "";
      }
      if(first !== ""){
        db.collection("users").doc(""+uid).update({
          vorname: first
        });
        document.getElementById("first_name1").value = "";
      }
      if(name !== ""){
        db.collection("users").doc(""+uid).update({
          nachname: name
        });
        document.getElementById("last_name1").value = "";
      }
      if(tele !== ""){
        db.collection("users").doc(""+uid).update({
          telefon: tele
        });
        document.getElementById("telefon_field").value = "";
      }

      var stid = user.storeId;
      if(stname !== ""){
        db.collection("stores").doc(""+stid).update({
          name: stname
        });
        document.getElementById("storename").value = "";
      }
      if(adr !== ""){
        db.collection("stores").doc(""+stid).update({
          adresse: adr
        });
        document.getElementById("storeadress").value = "";
      }
    }

  }).catch(function(error) {
    console.log(error);
  });
  qrCodeGen();
}