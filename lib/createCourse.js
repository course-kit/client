import { getProgress, getNextLessonId, isCourseEnrolled, isLessonComplete } from './helpers'

export default function ({ status, data }, user) {
  const lessons = data.lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    order: lesson.order,
    complete: user ? isLessonComplete(data.id, lesson.id, user) : null,
    ...lesson.publicContent
  }))
  return {
    status,
    course: {
      id: data.id,
      title: data.title,
      enrolled: isCourseEnrolled(data.id, user),
      nextLessonId: user ? getNextLessonId(lessons) : null,
      progress: user ? getProgress(lessons): null,
      lessons
    }
  }
}
