import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  userData: null,
};

let newUserData;

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_USER:
      return {
        userData: action.payload,
        activeRecepient: null,
      };

    case actionTypes.REMOVE_USER:
      return {
        userData: null,
      };

    case actionTypes.ADD_TO_RECEPIENTS_ARRAY:
      let temp = state.userData.recepients;
      temp.push(action.payload);
      return {
        userData: {
          ...state.userData,
          recepients: temp,
        },
      };

    case actionTypes.REMOVE_FROM_RECEPIENTS_ARRAY:
      console.log("u don't need this");
      //   logic to remove specified recepientId from recepients[]
      break;

    case actionTypes.SET_ACTIVE_RECEPIENT:
      return {
        ...state,
        activeRecepient: {
          recepientId: action.payload.recepientId,
          recepientData: action.payload.recepientData,
        },
      };

    case actionTypes.REMOVE_ACTIVE_RECEPIENT:
      return {
        ...state,
        activeRecepient: null,
      };

    case actionTypes.UPDATE_USER_AMOUNT:
      newUserData = state.userData;
      newUserData.amount = action.payload;
      return {
        ...state,
        userData: newUserData,
      };

    case actionTypes.UPDATE_USER_DETAILS:
      return {
        ...state,
        userData: {
          ...state.userData,
          userImageURL: action.payload.userImageURL,
          userName: action.payload.userName,
        },
      };

      case actionTypes.SET_DELETION_PASSWORD:
        return{
          ...state,
          userData : {
            ...state.userData,
            deletionPassword : action.payload
          }
        }

    default:
      return state;
  }
};

export default userReducer;
