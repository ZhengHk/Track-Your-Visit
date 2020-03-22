import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// export const testOnChange = functions.firestore.document('realtest/test1').onUpdate(change => {

//     console.info("CHANGE")

//     const after = change.after.data()

//     if (after) {
//         console.info("Aqr")
//         const payload = {
//             notification: {
//                 title: 'Du hast eine neue Freundschaftsanfrage',
//                 body: 'Tippe um sie Dir anzeigen zu lassen',
//             },
//             data: {
//                 click_action: 'FLUTTER_NOTIFICATION_CLICK',
//                 type: 'request',
//             }
//         };
//                 console.info(payload)
//                 return admin.messaging().sendToTopic("test", payload)

//                 //sendToTopic("notification-update", payload)
//                 .catch(error => {
//                     console.error("FCM failed", error)
//                 })
//     } else {

//         console.error("You failed")
//         return null
//     }
// })

export const notificationPush = functions.firestore.document('affected-query/{document}').onCreate(change => {

    const after = change.data()

    if (after) {
        //console.info("Sending")
        //console.info(after)

        // const payload = {
        //     notification: {
        //         title: 'Du hast ein hohes Ansteckungsrisiko',
        //         body: 'Aufgrund eines möglichen Kontaktes mit einem Infizierten raten wir dir zuhause zu bleiben',
        //     },
        //     data: {
        //         percentage: "null",
        //         click_action: 'FLUTTER_NOTIFICATION_CLICK',
        //     }
        // };
        //console.info(payload)
        console.info(after.constructor.name, "test16")

        //console.info(after.Ahk8tfi3zyeR6ZPuoTNONY4XUSz2)

        //const promises = []

        Object.entries(after).forEach(entry => {
            const key = entry[0];
            const value = entry[1];
            //use key and value here
            //console.info("ver1", key, value)

            const user = admin.firestore().doc(`fcm-tokens/${key}`).get()
            //                    promises.push(user)

            user.then(token => {
                //const per = value
                const data = token.data()
                if (data) {
                    console.info(key, "Payload creation", value)
                    const payload = {
                        notification: {
                            title: 'Du hast ein hohes Ansteckungsrisiko',
                            body: 'Aufgrund eines möglichen Kontaktes mit einem Infizierten raten wir dir zuhause zu bleiben',
                        },
                        data: {
                            percentage: value.toString(),
                            click_action: 'FLUTTER_NOTIFICATION_CLICK'
                        }
                    };
                    console.info(key, data.token, payload)
                    return admin.messaging().sendToDevice(data.token, payload)
                    //return admin.messaging().sendToTopic("test", payload)
                    //console.info("Send successfull")
                } else {
                    console.error("Error: Document data for key is empty: ", key)
                    return null
                }
            }
            ).catch(error => {
                console.error(error)
            })



        })

        //  return Promise.all(promises)
        // after.forEach((value: boolean, key: string) => {
        //     console.log(key, value);
        // });

        // const promises = []
        // for (const user in after) {
        //     const perc = 
        // }

        //return admin.messaging().sendToDevice(affected-query, payload)
        //.sendToTopic("test", payload)

        //.catch(error => {
        //   console.error("FCM failed", error)
        //})
        return null
    } else {

        console.error("You failed")
        return null
    }
})

// export const onChange = functions.firestore.document('users/5S70b94wMbgaGI39ZHQaGme58HG3').onUpdate(change => {
// //    const after = change.after.data()
//     console.info("CHANGE")
//     console.error("TEST?")

// // if (after !== null) {
// //     console.info("Trying send")
// //     const payload = {
// //         data : {
// //             vorname : String(after.vorname),
// //             clickaction : "FLUTTER_NOTIFICATION_CLICK",
// //             conditions: after.conditions
// //         }
// //     }
// //     return admin.messaging().sendToTopic("notification-update", payload)
// //     .catch(error => {
// //         console.error("FCM failed", error)
// //     })
// // }
//     return null
// })

//  export const betterWorld = functions.https.onRequest((request, response) => {
//   admin.firestore().doc('users/5S70b94wMbgaGI39ZHQaGme58HG3').get()
//   .then(snapshot => {
//       const data = snapshot.data()
//       response.send(data)
//   })
//   .catch(error => {
//     //Handle the error
//     console.log(error)
//     response.status(500).send(error)
//   })



//  })