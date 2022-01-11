import { PlayerSdk } from '@api.video/player-sdk'

const baseUrl = 'https://api.coursekit.dev'

class LessonLoader {
  constructor(courseId, lessonId, opts = {}) {
    this.courseId = courseId
    this.lessonId = lessonId
    this.baseUrl = opts.baseUrl || baseUrl
  }

  async loadPlayer(targetSelector, playerOptions = {}) {
    const response = await this.loadFromServer()
    if (response.status === 200) {
      try {
        const { video } = response.data
        if (video) {
          const { id, token } = video
          playerOptions.id = id
          playerOptions.token = token
          return {
            status: response.status,
            player: new PlayerSdk(targetSelector, playerOptions)
          }
        } else {
          return {
            status: response.status,
            player: null
          }
        }
      } catch (err) {
        console.log(err)
        return {
          status: 500
        }
      }
    }
    if (response.status === 401) {
      return { status: response.status }
    }
    return { status: response.status }
  }

  async loadContent() {
    const response = await this.loadFromServer()
    if (response.status === 200) {
      try {
        const { title, content, order } = response.data
        return {
          status: response.status,
          title, content, order
        }
      } catch (err) {
        console.log(err)
        return {
          status: 500
        }
      }
    }
    if (response.status === 401) {
      return { status: response.status }
    }
    return { status: response.status }
  }

  async loadFromServer() {
    if (this.cache) {
      return this.cache
    }
    let status
    let data
    if (typeof fetch === 'undefined') {
      status = 500
    } else {
      try {
        const response = await fetch(
          `${this.baseUrl}/courses/${this.courseId}/lessons/${this.lessonId}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )
        status = response.status
        if (status === 200) {
          data = await response.json()
        }
      } catch (err) {
        console.log(err)
        status = 500
      }
    }
    this.cache = { status, data }
    return { status, data }
  }
}

class UserLoader {
  constructor(opts = {}) {
    this.baseUrl = opts.baseUrl || baseUrl
  }

  async setComplete(courseId, lessonId, isComplete) {
    return await fetch(
      `${this.baseUrl}/courses/${courseId}/lessons/${lessonId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ complete: isComplete })
      }
    )
  }

  async markComplete(courseId, lessonId) {
    try {
      const response = await this.setComplete(courseId, lessonId, true)
      return response.status === 200
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async markIncomplete(courseId, lessonId) {
    try {
      const response = await this.setComplete(courseId, lessonId, false)
      return response.status === 200
    } catch (err) {
      console.log(err)
      return false
    }
  }

  buildUser(data) {
    const context = this
    return {
      isAuthenticated() {
        return !!data
      },
      getName() {
        return data
          ? data.name
          : null
      },
      login(opts) {
        if (!opts) {
          return console.error('You must provide an options object with either schoolId or courseId.')
        }
        if (!opts.courseId && !opts.schoolId) {
          return console.error('You must provide either schoolId or courseId in .login options.')
        }
        if (!data) {
          const searchParams = new URLSearchParams(opts);
          window.location.href = `${context.baseUrl}/login?${searchParams.toString()}`
        } else {
          return console.error('Already logged in.')
        }
      },
      logout(opts) {
        if (!opts) {
          return console.error('You must provide an options object with either schoolId or courseId.')
        }
        if (!opts.courseId && !opts.schoolId) {
          return console.error('You must provide either schoolId or courseId in .logout options.')
        }
        if (data) {
          const searchParams = new URLSearchParams(opts);
          window.location.href = `${context.baseUrl}/logout?${searchParams.toString()}`
        } else {
          return console.error('Already logged out.')
        }
      },
      async markComplete(courseId, lessonId) {
        if (data) {
          const success = await context.markComplete(courseId, lessonId)
          if (success) {
            const course = data.courses.find(course => course.id === courseId)
            const lesson = course.lessons.find(lesson => lesson.id === lessonId)
            lesson.complete = true
            return true
          }
        }
        return false
      },
      async markIncomplete(courseId, lessonId) {
        if (data) {
          const success = await context.markComplete(courseId, lessonId)
          if (success) {
            const course = data.courses.find(course => course.id === courseId)
            const lesson = course.lessons.find(lesson => lesson.id === lessonId)
            lesson.complete = false
            return true
          }
        }
        return false
      },
      isLessonComplete(courseId, lessonId) {
        if (data) {
          const course = data.courses.find(course => course.id === courseId)
          if (course) {
            const lesson = course.lessons.find(lesson => lesson.id === lessonId)
            if (lesson) {
              return lesson.complete
            }
          }
        }
        return null
      },
      isCourseEnrolled(courseId) {
        if (data) {
          return !!data.courses.find(course => course.id === courseId)
        }
        return null
      },
      getNextLessonId(courseId) {
        if (data) {
          const course = data.courses.find(course => course.id === courseId)
          if (course) {
            const lesson = course.lessons.find(lesson => !lesson.complete)
            return lesson.id
          }
        }
        return null
      },
      getProgress(courseId) {
        if (data) {
          const course = data.courses.find(course => course.id === courseId)
          if (course) {
            const complete = course.lessons.filter(lesson => lesson.complete)
            return Math.round(100 * complete.length / course.lessons.length) / 100
          }
        }
        return null
      }
    }
  }

  async loadUser () {
    let response
    if (this.cache) {
      response = this.cache
    } else {
      if (typeof fetch === 'undefined') {
        response = { status: 500, user: this.buildUser() }
      } else {
        try {
          const res = await fetch(
            `${this.baseUrl}/user`,
            {
              method: 'GET',
              credentials: 'include'
            }
          )
          if (res.status === 200) {
            const data = await res.json()
            response = { status, user: this.buildUser(data) }
          } else if (res.status !== 200 && res.status !== 500) {
            response = { status, user: this.buildUser() }
          }
        } catch (err) {
          console.log(err)
          response = { status: 500, user: this.buildUser() }
        }
      }
    }
    this.cache = response
    return response
  }
}

export { UserLoader, LessonLoader }
