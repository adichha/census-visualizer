import { action, observable, decorate } from 'mobx'
import { UserStore } from './UserStore'

export const USER_SESSION = 'UserSession';

const appLoadRoutine = [
  async () => {
    const storageValue = await localStorage.getItem(USER_SESSION)
    if (storageValue === null) {
      return
    }
    const token = storageValue
    UserStore.authToken = token
    UserStore.fetchUser(token)
  },
]

class PersistenceStore {
  isLoading = true

  async fetchItems() {
    this.isLoading = true
    await Promise.all(appLoadRoutine.map((routine) => routine()))
    this.isLoading = false
  }

  setItem(key, data) {
    localStorage.setItem(key.valueOf(), data)
  }

  clearItem(key) {
    localStorage.removeItem(key.valueOf())
  }
}

decorate(PersistenceStore, {
  isLoading: observable,
  fetchItems: action
})

const persistenceStore = new PersistenceStore()

export { persistenceStore as PersistenceStore }