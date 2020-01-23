import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};
export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

//async
export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true //boolean that is required - indicates if should return a token or not
    };

    //default url
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBcmwi6R0CaeY9l1jfEUo0u71MZsVxldKo';

    if (!isSignUp) {
      url =
        // note firebase v3 is diff from v1, v3: /identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBcmwi6R0CaeY9l1jfEUo0u71MZsVxldKo';
    }
    axios
      .post(url, authData)
      .then((response) => {
        console.log('SUCCESS: ', response);

        //localstorage
        //expiration date = new Date(new Date().getTime() + expiration time * 1000)
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        console.log('SAVING EXPIRATION DATE: ', expirationDate);
        //store in local storage
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationdate', expirationDate);
        localStorage.setItem('userid', response.data.localId);

        dispatch(authSuccess(response.data.idToken, response.data.localId));
        //invalidate token if timedout
        //start timer for token
        //expiresIn - amount of seconds until expires...
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        dispatch(authFail(err));
        //error codes
        //https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
      });
  };
};
export const logout = () => {
  //remove data in local storage
  localStorage.removeItem('token');
  localStorage.removeItem('expirationdate');
  localStorage.removeItem('userid');

  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

//starts with authSuccess
export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout()); //note: execute logout()
    }, expirationTime * 1000); //*1000 to convert from milliseconds (setTimeout units)
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    console.log('TOKEN:', token);
    if (!token) {
      dispatch(logout());
    } else {
      console.log('LOCAL STORAGE: ', localStorage);
      const expirationDate = new Date(localStorage.getItem('expirationdate'));
      console.log('EXPIRATIONDATE: ', expirationDate);
      //login ONLY if expirationDate is further ahead of current date
      if (expirationDate.getTime() <= new Date().getTime()) {
        console.log('LOGGGING OUT');
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userid');
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

//called when we want to adjust a route path
export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};
