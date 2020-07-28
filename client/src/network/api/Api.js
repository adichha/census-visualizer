import axios from 'axios'
import { UserStore } from '../../stores/UserStore'

export const baseUrl = 'http://census-viz.herokuapp.com/'

export class Api {
  static createRequest = (
    endpoint,
    requestType,
    payload
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios.request({
          url: `${baseUrl}${endpoint}`,
          method: requestType,
          headers: {
            Authorization:
              (UserStore.authToken && `Bearer ${UserStore.authToken}`) || '',
            'Content-Type': 'application/json',
          },
          data: payload || {},
        })
        resolve(response.data)
      } catch (e) {
        const {
          response: { data },
        } = e
        reject(data)
      }
    })

  static signUpUser = async (payload) => {
    await Api.createRequest('user/register', 'POST', payload)
  }

  static signInUser = async (
    payload
  ) => {
    const data = await Api.createRequest('user/login', 'POST', payload)
    return data
  }

}