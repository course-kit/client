import { isCourseEnrolled } from './helpers'

export default function ({ status, data }, user) {
  return {
    status,
    courses: data.map((course) => {
      return {
        id: course.id,
        title: course.title,
        enrolled: user ? isCourseEnrolled(course.id, user) : null,
        meta: {
          ...course.publicContent
        }
      }
    })
  }
}
