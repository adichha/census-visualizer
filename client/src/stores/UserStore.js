import { observable, decorate, action } from 'mobx'
import { PersistenceStore, USER_SESSION } from './PersistenceStore';
import { Api } from '../network/api/Api'

class UserStore {
  user;
  authToken;
  isLoading;
  requestError;
  requestErrorDetail;

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
    } catch (err) {
      this.requestError = true
      this.requestErrorDetail = err.message
    }
    this.isLoading = false
  }

  async loginUser(userCredentials) {
    this.isLoading = true
    try {
      const user = await Api.signInUser(userCredentials)
      this.authToken = user.authToken
      PersistenceStore.setItem(USER_SESSION, this.authToken)
      await this.fetchUser()
    } catch (err) {
      this.requestError = true
      this.requestErrorDetail = err.message
    }
    this.isLoading = false
  }

  resetErrors() {
    this.requestError = false
    this.requestErrorDetail = undefined
  }

  logout() {
    this.user = undefined
    this.authToken = undefined
    PersistenceStore.clearItem(USER_SESSION)
  }

  async fetchUser(token) {
    if (token) {
      this.authToken = token
    }
    this.user = await Api.fetchUser()
  }
}

decorate(UserStore, {
  user: observable,
  authToken: observable,
  isLoading: observable,
  requestError: observable,
  requestErrorDetail: observable,
  signUpUser: action,
  loginUser: action,
  resetErrors: action,
  logout: action,
  fetchUser: action
})

const userStore = new UserStore()

export { userStore as UserStore }