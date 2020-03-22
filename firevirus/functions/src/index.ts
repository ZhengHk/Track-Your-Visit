import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

//listen for newly created infection chains
export const notificationPush = functions.firestore.document('affected-query/{document}').onCreate(change => {

    const after = change.data()
    //check for existence
    if (after) {

        //iterate over all infected users
        Object.entries(after).forEach(entry => {
            
            //userid
            const key = entry[0];
            
            //infections percentage
            const value = entry[1];

            //get fcm-token for userid
            const user = admin.firestore().doc(`fcm-tokens/${key}`).get()

            user.then(token => {
                const data = token.data()

                //check if there is a token entry for this userid
                if (data) {
                    
                    const payload = {
                        notification: {
                            title: 'Du hast ein hohes Ansteckungsrisiko',
                            body: 'Aufgrund eines möglichen Kontaktes mit einem Infizierten raten wir dir zuhause zu bleiben.',
                        },
                        data: {
                            percentage: value.toString(),
                            click_action: 'FLUTTER_NOTIFICATION_CLICK'
                        }
                    };
                    
                    //send message using the token
                    return admin.messaging().sendToDevice(data.token, payload)

                } else {
                    console.error("Error: Document data for key is empty: ", key)
                    return null
                }
            }
            ).catch(error => {
                console.error(error)
                return null
            })
            
        })
        return null
        
    } else {
        console.error("Error: Document data for ", change.id, " is emnpty")
        return null
    }
})