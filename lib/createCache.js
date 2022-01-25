import createUser from './createUser'
import createCourse from './createCourse'
import createCourses from './createCourses'
import createLesson from './createLesson'

export default function (baseUrl, schoolId, devMode) {
  return {
    store: {
      user: null,
      courses: [],
      allCourses: null,
      lessons: []
    },
    addCourses(response) {
      this.store.allCourses = response
      return this.getCourses()
    },
    addCourse(courseId, response) {
      this.store.courses.push({ courseId, response })
      return this.getCourse(courseId)
    },
    addLesson(courseId, lessonId, response) {
      this.store.lessons.push({ courseId, lessonId, response })
      return this.getLesson(courseId, lessonId)
    },
    addUser(response) {
      this.store.user = response
      return this.getUser()
    },
    getCourses() {
      const courses = this.store.allCourses
      if (courses) {
        if (this.store.user && this.store.user.status === 200) {
          const user = this.store.user.data
          return createCourses(courses, user)
        } else {
          return createCourses(courses, null)
        }
      } else {
        return null
      }
    },
    getCourse(courseId) {
      const course = this.store.courses.find(course => {
        return course.courseId === courseId
      })
      if (course) {
        if (this.store.user && this.store.user.status === 200) {
          const user = this.store.user.data
          return createCourse(course.response, user)
        } else {
          return createCourse(course.response)
        }
      } else {
        return null
      }
    },
    getLesson(courseId, lessonId) {
      const lesson = this.store.lessons.find(lesson => {
        return lesson.courseId === courseId && lesson.lessonId === lessonId
      })
      if (lesson) {
        if (this.store.user && this.store.user.status === 200) {
          const user = this.store.user.data
          return createLesson(lesson.response, courseId, user, baseUrl)
        } else {
          return createLesson(lesson.response, courseId, null, baseUrl)
        }
      } else {
        return null
      }
    },
    getUser() {
      const user = this.store.user
      if (user) {
        return createUser(user, baseUrl, schoolId, devMode)
      } else {
        return null
      }
    }
  }
}
