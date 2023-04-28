import {
  getProgress,
  isCourseEnrolled,
  isLessonComplete,
  getNextIncompleteLesson,
  getNextLesson,
  getPreviousLesson
} from './helpers'
import markdownIt from 'markdown-it'
const md = markdownIt()

export default function ({ status, data }, user) {
  let html = null
  let markdown = null
  let meta
  if (data.publicContent && data.publicContent.content) {
    html = md.render(data.publicContent.markdown)
    markdown = data.publicContent.markdown
  } else {
    if (user) {
      html = md.render(data.privateContent.markdown)
      markdown = data.privateContent.markdown
    }
  }
  if (user) {
    meta = {
      ...data.publicContent,
      ...data.privateContent,
    }
  } else {
    meta = {
      ...data.publicContent
    }
  }
  delete meta.markdown
  const lessons = data.lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    order: lesson.order,
    complete: user ? isLessonComplete(data.id, lesson.id, user) : null,
    meta: {
      ...lesson.publicContent
    }
  })).sort((a, b) => (a.order >= b.order ? 1 : -1))
  const nextIncompleteLesson = user ? getNextIncompleteLesson(lessons) : null
  return {
    status,
    course: {
      id: data.id,
      title: data.title,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      enrolled: isCourseEnrolled(data.id, user),
      getNextLesson: (currentLessonId) => getNextLesson(currentLessonId, lessons),
      nextIncompleteLesson: nextIncompleteLesson,
      getPreviousLesson: (currentLessonId) => getPreviousLesson(currentLessonId, lessons),
      // deprecating nextLessonId in v1
      nextLessonId: nextIncompleteLesson ? nextIncompleteLesson.id : null,
      progress: user ? getProgress(lessons): null,
      lessons,
      meta,
      markdown,
      html,
    }
  }
}
