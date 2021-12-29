import { PlayerSdk } from '@api.video/player-sdk'

const baseUrl = 'https://api.coursekit.dev'

class VideoLoader {
  constructor(courseId, lessonId, opts = {}) {
    this.courseId = courseId
    this.lessonId = lessonId
    this.baseUrl = opts.baseUrl || baseUrl
  }

  async createPlayer(targetSelector, playerOptions = {}) {
    if (!fetch) {
      return { status: 500 }
    }
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.courseId}/${this.lessonId}`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )
      if (response.status === 200) {
        const { id, token } = await response.json()
        playerOptions.id = id
        playerOptions.token = token
        return { status: response.status, player: new PlayerSdk(targetSelector, playerOptions) }
      }
      if (response.status === 401) {
        const { loginUrl } = await response.json()
        return { status: response.status, loginUrl }
      }
      return { status: response.status }
    } catch (err) {
      console.log(err)
      return { status: 500 }
    }
  }
}

class UserLoader {
  constructor(opts = {}) {
    this.data = null
    this.baseUrl = opts.baseUrl || baseUrl
  }

  async markComplete(courseId, lessonId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/user/complete`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ courseId, lessonId })
        }
      )
      return response.status === 200
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async markIncomplete(courseId, lessonId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/user/complete`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ courseId, lessonId })
        }
      )
      return response.status === 200
    } catch (err) {
      console.log(err)
      return false
    }
  }

  buildUser() {
    return {
      isAuthenticated() {
        return this.data
      },
      getName() {
        return this.data
          ? this.data.name
          : null
      },
      getAccountUrl() {
        return this.data
          ? this.data.accountUrl
          : null
      },
      async markComplete(courseId, lessonId) {
        return this.data
          ? await this.markComplete(courseId, lessonId)
          : null
      },
      async markIncomplete(courseId, lessonId) {
        return this.data
          ? await this.markIncomplete(courseId, lessonId)
          : null
      },
      isLessonComplete(courseId, lessonId) {
        if (this.data) {
          const course = this.data.courses.find(course => course.id === courseId)
          const lesson = course.lessons.find(lesson => lesson.id === lessonId)
          return lesson.complete
        } else {
          return null
        }
      },
      isCourseEnrolled(courseId) {
        if (this.data) {
          const course = this.data.courses.find(course => course.id === courseId)
          return course.enrolled
        } else {
          return null
        }
      },
      getNextLessonId(courseId) {
        if (this.data) {
          const course = this.data.courses.find(course => course.id === courseId)
          const lesson = course.lessons.find(lesson => !lesson.complete)
          return lesson.id
        } else {
          return null
        }
      },
      getProgress(courseId) {
        if (this.data) {
          const course = this.data.courses.find(course => course.id === courseId)
          const complete = course.lessons.filter(lesson => lesson.complete)
          return Math.round(complete.length / course.lessons.length)
        } else {
          return null
        }
      }
    }
  }

  async createUser () {
    if (!fetch) {
      return { status: 500, user: this.buildUser() }
    }
    try {
      const response = await fetch(
        `${this.baseUrl}/user`,
        {
          method: 'GET',
          credentials: 'include'
        }
      )
      if (response.status === 200) {
        const { user } = await response.json()
        this.data = user
        return { status, user: this.buildUser() }
      }
      if (response.status !== 200 && response.status !== 500) {
        const { loginUrl } = await response.json()
        return { status, loginUrl, user: this.buildUser() }
      }
    } catch (err) {
      console.log(err)
      return { status: 500, user: this.buildUser() }
    }
  }
}

export { UserLoader, VideoLoader }
