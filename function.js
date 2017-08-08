const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


//Onwrite Trigger Function
//Here muser_id is the one who receives the notification
 exports.sendMessageNotification = functions.database.ref('/MessageNoti/{muser_id}/{mnotification_id}').onWrite(event =>{

    const muser_id = event.params.muser_id;
    const mnotification_id = event.params.mnotification_id;


	/* In android app when user taps on send message button, store 'from', 'type', and 'message'into the database
	And read them here.*/	
    const mfromUser_query = admin.database().ref(`/MessageNoti/${muser_id}/${mnotification_id}/from`).once('value');
    const mtype_query = admin.database().ref(`/MessageNoti/${muser_id}/${mnotification_id}/type`).once('value');
    const mmessage_query = admin.database().ref(`/MessageNoti/${muser_id}/${mnotification_id}/message`).once('value');


    return Promise.all([mfromUser_query,mtype_query,mmessage_query]).then(result =>{

        const mfrom_user_id = result[0].val();
        const type = result[1].val();
        const mmessage = result[2].val();
	/* mfrom_user_id is the one who sent the message. we retreive his name and device token stored earlier in "Users/mfrom_user_id".*/
        const muserQuery = admin.database().ref(`Users/${mfrom_user_id}/name`).once('value');
        const mdeviceToken = admin.database().ref(`/Users/${muser_id}/device_token`).once('value');

        return Promise.all([muserQuery, mdeviceToken]).then(result => {

      const muserName = result[0].val();
      const mtoken_id = result[1].val();

      /*
       *  'payload' to create a notification to be sent.
       */

/*set the default notification payload for when the app in the clients device is in background.*/
      const mpayload = {
        notification: {
          title : muserName,
          body: mmessage,
          icon: "default",
          tag: mnotification_id,
          sound: "default",
          click_action : "android.chatapp.ib.ichat_TARGET_MNOTIFICATION"
        },
        data: {
          from_user_id : mfrom_user_id,
          from_username : muserName,
          type : type
          }
      };

      /*Sending payload to device token id we retrieved
	/*

      return admin.messaging().sendToDevice(mtoken_id, mpayload).then(response => {

        console.log("Message noti sent to ", muser_id);

        });

      });

    });

 });