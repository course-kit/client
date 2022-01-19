import { getProgress, getNextLessonId, isCourseEnrolled } from './courseHelpers'

export default function ({ status, data }, user) {
  return {
    status,
    courses: data.courses.map(({ id }) => {
      return {
        id,
        enrolled: isCourseEnrolled(id, user),
        getNextLessonId: getNextLessonId(id, user),
        getProgress: getProgress(id, user)
      }
    })
  }
}
