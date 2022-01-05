import { PlayerSdk } from '@api.video/player-sdk'

const baseUrl = 'https://api.coursekit.dev'

class LessonLoader {
  constructor(courseId, lessonId, opts = {}) {
    this.courseId = courseId
    this.lessonId = lessonId
    this.baseUrl = opts.baseUrl || baseUrl
  }

  async load(targetSelector, playerOptions = {}) {
    if (typeof fetch === 'undefined') {
      return { status: 500 }
    }
    try {
      const response = await fetch(
        `${this.baseUrl}/courses/${this.courseId}/lessons/${this.lessonId}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      )
      if (response.status === 200) {
        const { title, content, order, video } = await response.json()
        if (video) {
          const { id, token } = video
          playerOptions.id = id
          playerOptions.token = token
        }
        return {
          status: response.status,
          lesson: {
            title, content, order
          },
          player: new PlayerSdk(targetSelector, playerOptions)
        }
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

async function setComplete(courseId, lessonId, isComplete) {
  return await fetch(
    `${this.baseUrl}/courses/${courseId}/lessons/${lesson}`,
    {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ complete: isComplete })
    }
  )
}

class UserLoader {
  constructor(opts = {}) {
    this.baseUrl = opts.baseUrl || baseUrl
  }

  async markComplete(courseId, lessonId) {
    try {
      const response = setComplete(courseId, lessonId, true)
      return response.status === 200
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async markIncomplete(courseId, lessonId) {
    try {
      const response = setComplete(courseId, lessonId, false)
      return response.status === 200
    } catch (err) {
      console.log(err)
      return false
    }
  }

  buildUser(data) {
    return {
      isAuthenticated() {
        return !!data
      },
      getName() {
        return data
          ? data.name
          : null
      },
      getAccountUrl() {
        return data
          ? data.accountUrl
          : null
      },
      async markComplete(courseId, lessonId) {
        return data
          ? await this.markComplete(courseId, lessonId)
          : null
      },
      async markIncomplete(courseId, lessonId) {
        return data
          ? await this.markIncomplete(courseId, lessonId)
          : null
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
            return Math.round(complete.length / course.lessons.length)
          }
        }
        return null
      }
    }
  }

  async load () {
    if (typeof fetch === 'undefined') {
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
        const data = await response.json()
        return { status, user: this.buildUser(data) }
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

export { UserLoader, LessonLoader }
