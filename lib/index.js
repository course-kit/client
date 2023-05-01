import createCache from './createCache'
import createApi from './createApi'
import {tokenSet, tokenGet, tokenRemove} from "./authTokens";

const baseUrl = 'https://api.coursekit.dev/v1'

function createErrorObject(err, status = 500) {
  console.log(err)
  return { status }
}

function getTokens (authSessionStorage) {
  let accessToken
  let refreshToken
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    accessToken = urlParams.get('access_token')
    refreshToken = urlParams.get('refresh_token')
    if (accessToken && refreshToken) {
      const accessExpiry = new Date(new Date().getTime() + (3600 * 1000))
      const refreshExpiry = new Date(new Date().getTime() + (43200 * 60 * 1000))
      tokenSet('access_token', accessToken, { expires: accessExpiry}, !authSessionStorage)
      tokenSet('refresh_token', refreshToken, { expires: refreshExpiry }, !authSessionStorage)
      urlParams.delete('access_token')
      urlParams.delete('refresh_token')
      const url = window.location.href.split('?')[0] + '?' + urlParams.toString()
      window.history.replaceState({}, document.title, url)
    } else {
      accessToken = tokenGet('access_token', !authSessionStorage)
      refreshToken = tokenGet('refresh_token', !authSessionStorage)
    }
  }
  return { accessToken, refreshToken }
}

export class CourseKitClient {
  constructor(opts) {
    if (!opts || !opts.schoolId) {
      throw new Error('You must provide a schoolId option in the constructor.')
    }
    this.schoolId = opts.schoolId
    const devMode = opts.devMode || false
    const tokens = getTokens(opts.authSessionStorage)
    this.api = createApi(opts.baseUrl || baseUrl, tokens, devMode, opts.authSessionStorage)
    this.cache = createCache(opts.baseUrl || baseUrl, opts.schoolId, devMode, this.api)
  }

  async loadUser() {
    let obj = this.cache.getUser()
    if (!obj) {
      try {
        const response = await this.api.loadUser()
        obj = this.cache.addUser(response)
      } catch (err) {
        obj = createErrorObject(err)
      }
    }
    return obj
  }

  async loadCourseSummaries() {
    let obj = this.cache.getCourses()
    if (!obj) {
      try {
        const response = await this.api.loadCourses(this.schoolId)
        obj = this.cache.addCourses(response)
      } catch (err) {
        obj = createErrorObject(err)
      }
    }
    return obj
  }

  async loadCourse(courseId) {
    let obj = this.cache.getCourse(courseId)
    if (!obj) {
      try {
        const response = await this.api.loadCourse(courseId)
        obj = this.cache.addCourse(courseId, response)
      } catch (err) {
        obj = createErrorObject(err)
      }
    }
    return obj
  }

  async loadLesson(courseId, lessonId) {
    let obj = this.cache.getLesson(courseId, lessonId)
    if (!obj) {
      try {
        const response = await this.api.loadLesson(courseId, lessonId)
        obj = this.cache.addLesson(courseId, lessonId, response)
      } catch (err) {
        obj = createErrorObject(err)
      }
    }
    return obj
  }
}
