import actionsTypes from "./actionTypes";
import { auth, db, firebase, storage } from "../firebaseFile";
import axios from "axios";

// supporting function
export const fetchAllData = (dispatch, userId) => {
  return new Promise((resolve, reject) => {
    console.log("in fetchAllData");
    //fetch user
    console.log(userId);
    db.doc(`/users/${userId}`)
      .get()
      .then((doc) => {
        const userDataFromFirebase = doc.data();
        // localStorage.setItem("userId", userId);
        dispatch({
          type: actionsTypes.ADD_USER,
          payload: userDataFromFirebase,
        });

        // fetch recepients
        if (userDataFromFirebase && userDataFromFirebase.recepients.length) {
          db.collection("recepients")
            .where("userId", "==", userId)
            .get()
            .then((querySnapshot) => {
              let allRecepients = [];
              querySnapshot.forEach((doc) => {
                allRecepients.push(doc.data());
              });

              // code to sort allRecepients according to createdAt
              function compare(a, b) {
                if (new Date(b.createdAt) < new Date(a.createdAt)) {
                  return -1;
                }
                if (new Date(b.createdAt) > new Date(a.createdAt)) {
                  return 1;
                }
                return 0;
              }
              allRecepients.sort(compare);

              dispatch({
                type: actionsTypes.ADD_RECEPIENT,
                payload: allRecepients,
              });
            });
        }

        // fetch all(for now) reminders
        let allReminders = [];
        db.collection("reminders")
          .where("userId", "==", userId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              allReminders.push(doc.data());
            });

            dispatch({
              type: actionsTypes.ADD_REMINDER,
              payload: allReminders,
            });
          });

        resolve("Data fetch successfull");
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("Data fetch Failed");
          alert("Data fetch Failed");
        }
      });
  });
};

//------------------------------------> related to user <-----------------------------------------------
// login
export const loginAPI = (dispatch, userDetails) => {
  return new Promise((resolve, reject) => {
    let userId;
    auth
      .signInWithEmailAndPassword(
        userDetails.userEmail,
        userDetails.userPassword
      )
      .then((data) => {
        userId = data.user.uid;
        localStorage.setItem("userId", userId);
        fetchAllData(dispatch, userId).then((message) =>
          resolve("successfully logged in :)")
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/user-not-found") {
          reject("User with the provided credentials does not exists.");
          alert("User with the provided credentials does not exists.");
        } else if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else if (e.code === "auth/wrong-password") {
          reject("Wrong Password !");
          alert("Wrong Password !");
        } else {
          reject("Login Failed");
          alert("Login Failed");
        }
      });
  });
};

// signup
export const signupAPI = (dispatch, userDetails) => {
  return new Promise((resolve, reject) => {
    let userId;
    auth
      .createUserWithEmailAndPassword(
        userDetails.userEmail,
        userDetails.userPassword
      )
      .then((data) => {
        userId = data.user.uid;
        localStorage.setItem("userId", userId);
        // storing in database:firebase
        const userDataForFirebase = {
          userName: userDetails.userName,
          userEmail: userDetails.userEmail,
          userPassword: userDetails.userPassword,
          userImageURL: userDetails.userImageURL
            ? userDetails.userImageURL
            : "https://firebasestorage.googleapis.com/v0/b/myfrdiary.appspot.com/o/images%2Fno-image.png?alt=media&token=ca319164-23a0-4c9e-94e3-73714496b25b",
          createdAt: new Date().toISOString(),
          // createdAt : firebase.firestore.FieldValue.serverTimestamp(),
          userId,
          recepients: [],
          amount: {
            total: 0,
            lent: 0,
            borrowed: 0,
          },
        };
        db.doc(`/users/${userId}`)
          .set(userDataForFirebase)
          .then(() => {
            dispatch({
              type: actionsTypes.ADD_USER,
              payload: userDataForFirebase,
            });
            resolve("Successfully Signed Up");
          });
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else if (e.code === "auth/email-already-in-use") {
          reject("This email is already in use!");
          alert("This email is already in use!");
        } else {
          reject("SignUp Failed");
          alert(`SignUp Failed  $ ${e}`);
        }
      });
  });
};

// signout / logout
export const signOutAPI = (dispatch) => {
  return new Promise((resolve, reject) => {
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        dispatch({
          type: actionsTypes.REMOVE_ALLRECEPIENTS,
        });
        dispatch({
          type: actionsTypes.REMOVE_USER,
        });

        resolve("Signout successfull");
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("Logout Failed");
          alert(`Logout Failed $ ${e}`);
        }
      });
  });
};

export const updateUserAmountAPI = (dispatch, userId, newUserAmount) => {
  return new Promise((resolve, reject) => {
    // code for pushing the changes into firebase database
    db.doc(`users/${userId}`)
      .update({ amount: newUserAmount })
      .then(() => {
        // this code is for pushing changes into redux frontend
        dispatch({
          type: actionsTypes.UPDATE_USER_AMOUNT,
          payload: newUserAmount,
        });
        dispatch({
          type: actionsTypes.TOGLLE_UPDATE,
        });
        resolve("updateUserAmount successfull");
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("updateUserAmount Failed");
          alert("updateUserAmount Failed");
        }
      });
  });
};

// update user details
export const updateUserDetailsAPI = (
  dispatch,
  userData,
  updatedUserDetails
) => {
  return new Promise((resolve, reject) => {
    if (updatedUserDetails.image.size > 0) {
      let uploadTask = storage
        .ref(`images/${updatedUserDetails.imageName}`)
        .put(updatedUserDetails.image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(updatedUserDetails.imageName)
            .getDownloadURL()
            .then((url) => {
              updatedUserDetails = { ...updatedUserDetails, userImageURL: url };

              // code to delete the existing profile pic other than the default image(no-image.png)
              if (updatedUserDetails.oldImageName !== "no-image.png") {
                storage
                  .ref()
                  .child(`/images/${updatedUserDetails.oldImageName}`)
                  .delete()
                  .then(() => {
                    console.log(
                      `deleted the file ${updatedUserDetails.oldImageName}`
                    );
                  })
                  .catch((e) =>
                    console.log(
                      `something went wrong while deleting ${updatedUserDetails.oldImageName}`
                    )
                  );
              }

              db.doc(`/users/${userData.userId}`)
                .update({
                  userImageURL: updatedUserDetails.userImageURL,
                  userName: updatedUserDetails.userName,
                })
                .then(() => {
                  dispatch({
                    type: actionsTypes.UPDATE_USER_DETAILS,
                    payload: updatedUserDetails,
                  });
                  // promise is resolved here ..
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                  reject();
                });
            });
        }
      );
    } else if (updatedUserDetails.userName !== userData.userName) {
      // code to only update the userName

      updatedUserDetails = {
        ...updatedUserDetails,
        userImageURL: userData.userImageURL,
      };

      db.doc(`/users/${userData.userId}`)
        .update({
          userName: updatedUserDetails.userName,
        })
        .then(() => {
          dispatch({
            type: actionsTypes.UPDATE_USER_DETAILS,
            payload: updatedUserDetails,
          });
          // promise is resolved here ..
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    } else {
      resolve();
    }
  });
};

//-------------------------------------------------> related to recepient <---------------------------------------------------------------
export const addRecepientAPI = (
  dispatch,
  userId,
  recepientData,
  additionalData
) => {
  return new Promise((resolve, reject) => {
    let recepientId;
    console.log("adding recepient");

    // upload the image and update recepientData[imageURL]
    if (additionalData.image !== "") {
      let uploadTask = storage
        .ref(`images/${additionalData.imageName}`)
        .put(additionalData.image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(additionalData.imageName)
            .getDownloadURL()
            .then((url) => {
              recepientData["recepientImageURL"] = url;

              // aad recepient data in collection named recepients also store its uid
              db.collection("recepients")
                .add(recepientData)
                .then((doc) => {
                  recepientId = doc.id;
                  // append recepients uid(from above) into recepients[] in collection named users
                  db.doc(`/users/${userId}`).update({
                    recepients:
                      firebase.firestore.FieldValue.arrayUnion(recepientId),
                  });
                  // insert recepientId in the doc of collection recepients
                  db.doc(`/recepients/${recepientId}`).update({
                    recepientId,
                  });

                  let updatedRecepientData = recepientData;
                  updatedRecepientData["recepientId"] = recepientId;
                  // dispatch addRecepient
                  dispatch({
                    type: actionsTypes.ADD_RECEPIENT,
                    payload: updatedRecepientData,
                  });

                  // also dispatch ADD_TO_RECEPIENTS_ARRAY to append new recepientId to recepients[] of user
                  dispatch({
                    type: actionsTypes.ADD_TO_RECEPIENTS_ARRAY,
                    payload: recepientId,
                  });
                  dispatch({
                    type: actionsTypes.TOGLLE_UPDATE,
                  });
                  resolve("addRecepient successfull.");
                });
            })
            .catch((e) => {
              console.log(e);
              if (e.code === "auth/network-request-failed") {
                reject("No internet Connection");
                alert("No internet Connection");
              } else {
                reject("addRecepient Failed");
                alert("addRecepient Failed");
              }
            });
        }
      );
    } else {
      // aad recepient data in collection named recepients also store its uid
      db.collection("recepients")
        .add(recepientData)
        .then((doc) => {
          recepientId = doc.id;
          // append recepients uid(from above) into recepients[] in collection named users
          db.doc(`/users/${userId}`).update({
            recepients: firebase.firestore.FieldValue.arrayUnion(recepientId),
          });
          // insert recepientId in the doc of collection recepients
          db.doc(`/recepients/${recepientId}`).update({
            recepientId,
          });

          let updatedRecepientData = recepientData;
          updatedRecepientData["recepientId"] = recepientId;
          // dispatch addRecepient
          dispatch({
            type: actionsTypes.ADD_RECEPIENT,
            payload: updatedRecepientData,
          });

          // also dispatch ADD_TO_RECEPIENTS_ARRAY to append new recepientId to recepients[] of user
          dispatch({
            type: actionsTypes.ADD_TO_RECEPIENTS_ARRAY,
            payload: recepientId,
          });
          dispatch({
            type: actionsTypes.TOGLLE_UPDATE,
          });
          resolve("addRecepient successfull.");
        })
        .catch((e) => {
          console.log(e);
          if (e.code === "auth/network-request-failed") {
            reject("No internet Connection");
            alert("No internet Connection");
          } else {
            reject("addRecepient Failed");
            alert("addRecepient Failed");
          }
        });
    }
  });
};

export const removeRecepientAPI = (
  dispatch,
  userId,
  recepientId,
  allRecepientIds
) => {
  return new Promise((resolve, reject) => {
    console.log(recepientId);
    allRecepientIds.splice(allRecepientIds.indexOf(recepientId), 1);
    console.log(allRecepientIds);

    //code to remove recepient from collection named recepients
    db.doc(`/recepients/${recepientId}`)
      .delete()
      .then(() => {
        //code to remove recepientId from recepients[] in collection named users
        db.doc(`/users/${userId}`).update({
          recepients: firebase.firestore.FieldValue.arrayRemove(recepientId),
        });

        dispatch({
          type: actionsTypes.REMOVE_ONERECEPIENT,
          payload: recepientId,
        });

        dispatch({
          type: actionsTypes.REMOVE_ACTIVE_RECEPIENT,
        });

        resolve("removed recepient Successfully.");
        // dispatch({
        //   type: actionsTypes.TOGLLE_UPDATE,
        // });
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("remove one recepient Failed");
          alert("remove one recepient Failed");
        }
      });
  });
};

export const setActiveRecepientAPI = (dispatch, recepientData) => {
  return new Promise((resolve, reject) => {
    console.log("setting active recepient");
    dispatch({
      type: actionsTypes.SET_ACTIVE_RECEPIENT,
      payload: {
        recepientId: recepientData.recepientId,
        recepientData,
      },
    });
    resolve("setActiveRecepient successfull.");
  });
};

export const addTransactionAPI = (dispatch, transactionData, recepientId) => {
  return new Promise((resolve, reject) => {
    console.log("in addTrnasaction api");
    // code to add to firebase
    db.doc(`/recepients/${recepientId}`)
      .update({
        transactions: firebase.firestore.FieldValue.arrayUnion(transactionData),
      })
      .then(() => {
        console.log("adding transaction details..");
        dispatch({
          type: actionsTypes.ADD_TRANSACTION,
          payload: {
            recepientId,
            transactionData,
          },
        });
        // dispatch({
        //   type: actionsTypes.TOGLLE_UPDATE,
        // });
        resolve("AddTransaction successfull");
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("AddTransaction Failed");
          alert("AddTransaction Failed");
        }
      });
  });
};

export const deleteTransactionAPI = (
  dispatch,
  recepientId,
  transactionData
) => {
  return new Promise((resolve, reject) => {
    console.log(
      `Delete the transaction with the transactionId = ${transactionData.transactionId}`
    );

    // code to remove from firebase
    db.doc(`/recepients/${recepientId}`)
      .update({
        transactions:
          firebase.firestore.FieldValue.arrayRemove(transactionData),
      })
      .then(() => {
        console.log("removing transaction details..");
        dispatch({
          type: actionsTypes.REMOVE_TRANSACTION,
          payload: {
            recepientId,
            transactionData,
          },
        });
        // dispatch({
        //   type: actionsTypes.TOGLLE_UPDATE,
        // });
        resolve("deleteTransaction successfull");
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("deleteTransaction Failed");
          alert("deleteTransaction Failed");
        }
      });
  });
};

export const updateRecepientAmountAPI = (
  dispatch,
  recepientId,
  newRecepientAmount
) => {
  return new Promise((resolve, reject) => {
    // code for pushing the changes into firebase database
    db.doc(`recepients/${recepientId}`)
      .update({ amount: newRecepientAmount })
      .then(() => {
        // this code is for pushing changes into redux frontend
        dispatch({
          type: actionsTypes.UPDATE_RECEPIENT_AMOUNT,
          payload: { newRecepientAmount, recepientId },
        });
        // dispatch({
        //   type: actionsTypes.TOGLLE_UPDATE,
        // });
        resolve("updateRecepientAmount successfull");
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("updateRecepientAmount Failed");
          alert("updateRecepientAmount Failed");
        }
      });
  });
};

// update recepient details
export const updateRecepientDetailsAPI = (
  dispatch,
  recepientId,
  recepientData,
  updatedRecepientDetails
) => {
  return new Promise((resolve, reject) => {
    if (updatedRecepientDetails.image !== "") {
      // update all needed info related to image

      let uploadTask = storage
        .ref(`images/${updatedRecepientDetails.imageName}`)
        .put(updatedRecepientDetails.image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(updatedRecepientDetails.imageName)
            .getDownloadURL()
            .then((url) => {
              updatedRecepientDetails = {
                ...updatedRecepientDetails,
                recepientImageURL: url,
              };

              // code to delete the existing profile other than the default image(no-image.png)
              if (updatedRecepientDetails.oldImageName !== "no-image.png") {
                storage
                  .ref("images")
                  .child(`${updatedRecepientDetails.oldImageName}`)
                  .delete()
                  .then(() =>
                    console.log(
                      `deleted image ${updatedRecepientDetails.oldImageName}`
                    )
                  )
                  .catch((e) => {
                    console.log(`The error occured is : ${e}`);
                  });
              }

              // updating with the url
              db.doc(`/recepients/${recepientData.recepientId}`)
                .update({
                  recepientImageURL: updatedRecepientDetails.recepientImageURL,
                  recepientName: updatedRecepientDetails.recepientName,
                  recepientNickname: updatedRecepientDetails.recepientNickname,
                  recepientPhone: updatedRecepientDetails.recepientPhone,
                })
                .then(() => {
                  dispatch({
                    type: actionsTypes.UPDATE_RECEPIENT_DETAILS,
                    payload: { updatedRecepientDetails, recepientId },
                  });
                  // promise is resolved here ..
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                  reject();
                });
            });
        }
      );
    } else if (
      updatedRecepientDetails.recepientName !== recepientData.recepientName ||
      updatedRecepientDetails.recepientNickname !==
        recepientData.recepientNickname ||
      updatedRecepientDetails.rcepientPhone !== recepientData.recepientPhone
    ) {
      console.log('updating recepient"s name, nickName, phone');
      resolve();
    } else {
      resolve();
    }
  });
};

// fast2sms ... **not used.
export const sendSMSAPI = (dispatch, details) => {
  const header = {
    authorization:
      "MODxa64KzcWlgCnvp1SksIqAUm9w5bjXGJiPH3RY7eoZ0VyftE1jG3KSHY4AJlLQUhcxp6y7X8Tq2Owr",
    "Content-Type": "application/json",
  };

  const content = {
    route: "q",
    message: details.message,
    language: "english",
    flash: 0,
    numbers: details.to.recepientPhone,
  };
  console.log(content);
  return new Promise((resolve, reject) => {
    axios
      .post("https://www.fast2sms.com/dev/bulkV2", content, { header })
      .then((res) => {
        resolve(res.message);
      })
      .catch((e) => reject(e));
  });
};

export const setDeletionPasswordAPI = (data, dispatch) => {
  return new Promise((resolve, reject) => {
    db.doc(`/users/${data.userId}`)
      .update({
        deletionPassword: data.deletionPassword,
      })
      .then(() => {
        console.log("successfully configured deletion password..");
        dispatch({
          type: actionsTypes.SET_DELETION_PASSWORD,
          payload: data.deletionPassword,
        });
        resolve("deletion password configured successfully..");
      })
      .catch((e) => {
        console.log(`Document userId : ${data.userId} does not exists`);
        reject("Sttting deletion password failed");
      });
  });
};

export const addReminderAPI = (reminderDetails, dispatch) => {
  return new Promise((resolve, reject) => {
    db.collection("reminders")
      .add(reminderDetails)
      .then((doc) => {
        let reminderId = doc.id;
        db.doc(`/reminders/${reminderId}`).update({
          reminderId,
        });
        reminderDetails["reminderId"] = reminderId;
        dispatch({
          type: actionsTypes.ADD_REMINDER,
          payload: reminderDetails,
        });
        resolve(reminderId);
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("addReminder Failed");
          alert("addReminder Failed");
        }
      });
  });
};

export const deleteReminderAPI = (dispatch, reminderId) => {
  return new Promise((resolve, reject) => {
    db.doc(`reminders/${reminderId}`)
      .delete()
      .then(() => {
        dispatch({
          type: actionsTypes.REMOVE_REMINDER,
          payload: reminderId,
        });
        resolve("Reminder removed successfully");
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/network-request-failed") {
          reject("No internet Connection");
          alert("No internet Connection");
        } else {
          reject("Remving reminder Failed");
          alert("Remving reminder Failed");
        }
      });
  });
};
