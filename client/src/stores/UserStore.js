import { observable, decorate, action } from 'mobx'
import { PersistenceStore, USER_SESSION } from './PersistenceStore';
import { Api } from '../network/api/Api'

class UserStore {
  user;
  authToken;
  isLoading;
  requestError;
  requestErrorDetail;
  userInfo;

  get isSignedIn() {
    return (
      this.authToken &&
      this.authToken.length > 0
    )
  }

  async signUpUser(userCredentials) {
    this.isLoading = true
    try {
      await Api.signUpUser(userCredentials)
      return false;
    } catch (err) {
      this.requestError = true
      this.requestErrorDetail = err.message
    }
    this.isLoading = false
    return true;
  }

  async loginUser(userCredentials) {
    this.isLoading = true
    try {
      const user = await Api.signInUser(userCredentials)
      this.userInfo = {
        firstName: user.first_name,
        lastName: user.last_name
      }
      this.authToken = user.token
      PersistenceStore.setItem(USER_SESSION, {
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        token: this.authToken
      })
      return false;
    } catch (err) {
      this.requestError = true
      this.requestErrorDetail = err.message
    }
    this.isLoading = false
    return true;
  }

  resetErrors() {
    this.requestError = false
    this.requestErrorDetail = undefined
  }

  logout() {
    this.user = undefined
    this.authToken = undefined
    this.userInfo = undefined
    PersistenceStore.clearItem(USER_SESSION)
  }
}

decorate(UserStore, {
  user: observable,
  authToken: observable,
  isLoading: observable,
  requestError: observable,
  requestErrorDetail: observable,
  userInfo: observable,
  signUpUser: action,
  loginUser: action,
  resetErrors: action,
  logout: action,
  fetchUser: action
})

const userStore = new UserStore()

export { userStore as UserStore }