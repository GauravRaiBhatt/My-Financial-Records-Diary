import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  update: false,
  recepientData: [],
  reminders: [],
};
let newrecepientData = [],
  reminders = [];

const dataReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_RECEPIENT:
      newrecepientData = [];
      action.payload.length
        ? newrecepientData.push(...action.payload)
        : newrecepientData.push(action.payload);
      newrecepientData = [...newrecepientData, ...state.recepientData];
      return {
        ...state,
        recepientData: newrecepientData,
      };

    case actionTypes.REMOVE_ONERECEPIENT:
      newrecepientData = [];
      state.recepientData.forEach((recepient) => {
        if (recepient.recepientId !== action.payload)
          newrecepientData.push(recepient);
      });
      return {
        ...state,
        recepientData: newrecepientData,
      };

    case actionTypes.REMOVE_ALLRECEPIENTS:
      return {
        ...state,
        recepientData: [],
      };

    case actionTypes.ADD_TRANSACTION:
      newrecepientData = [];
      newrecepientData = state.recepientData;
      newrecepientData.map((recepient) => {
        if (recepient.recepientId === action.payload.recepientId)
          recepient.transactions.push(action.payload.transactionData);
      });
      return {
        ...state,
        recepientData: newrecepientData,
      };

    case actionTypes.REMOVE_TRANSACTION:
      newrecepientData = [];
      newrecepientData = state.recepientData;
      newrecepientData.map((recepient) => {
        if (recepient.recepientId === action.payload.recepientId) {
          // code to remove one transaction =>(action.payload.transactionData) from recepient.transactions[]
          let allTransactions = recepient.transactions.filter(
            (transaction) =>
              transaction.transactionId !==
              action.payload.transactionData.transactionId
          );

          recepient.transactions = allTransactions;
        }
      });
      return {
        ...state,
        recepientData: newrecepientData,
      };

    case actionTypes.TOGLLE_UPDATE:
      return {
        ...state,
        update: !state.update,
      };

    case actionTypes.UPDATE_RECEPIENT_AMOUNT:
      newrecepientData = [];
      newrecepientData = state.recepientData;
      newrecepientData.map((recepient) => {
        if (recepient.recepientId === action.payload.recepientId)
          recepient.amount = action.payload.newRecepientAmount;
      });
      return {
        ...state,
        recepientData: newrecepientData,
      };

    case actionTypes.UPDATE_RECEPIENT_DETAILS:
      newrecepientData = [];
      newrecepientData = state.recepientData;
      newrecepientData.map((recepient) => {
        if (recepient.recepientId == action.payload.recepientId) {
          recepient.recepientName =
            action.payload.updatedRecepientDetails.recepientName;
          recepient.recepientNickname =
            action.payload.updatedRecepientDetails.recepientNickname;
          recepient.recepientPhone =
            action.payload.updatedRecepientDetails.recepientPhone;
          recepient.recepientImageURL =
            action.payload.updatedRecepientDetails.recepientImageURL;
        }
      });
      console.log(newrecepientData);
      return {
        ...state,
        recepientData: newrecepientData,
      };

    case actionTypes.ADD_REMINDER:
      reminders = [];
      action.payload.length
        ? (reminders = [...action.payload, ...state.reminders])
        : (reminders = [action.payload, ...state.reminders]);
      return {
        ...state,
        reminders: reminders,
      };

    case actionTypes.REMOVE_REMINDER:
      reminders = [];
      state.reminders.forEach((reminder) => {
        if (reminder.reminderId !== action.payload) reminders.push(reminder);
      });
      console.log(reminders);
      return {
        ...state,
        reminders: reminders,
      };

    default:
      return state;
  }
};

export default dataReducer;
