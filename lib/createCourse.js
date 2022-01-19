import { getProgress, getNextLessonId, isCourseEnrolled } from './courseHelpers'

export default function ({ status, data }, user) {
  return {
    status,
    course: {
      id: data.id,
      title: data.title,
      enrolled: isCourseEnrolled(data.id, user),
      nextLessonId: getNextLessonId(data.id, user),
      progress: getProgress(data.id, user),
      lessons: data.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        ...lesson.publicContent
      }))
    }
  }
}
