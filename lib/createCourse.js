import { getProgress, getNextLessonId, isCourseEnrolled, isLessonComplete } from './helpers'
import markdownIt from 'markdown-it'
const md = markdownIt()

export default function ({ status, data }, user) {
  let html = null
  let markdown = null
  let meta
  if (user) {
    html = md.render(data.privateContent.markdown)
    markdown = data.privateContent.markdown
    meta = {
      ...data.publicContent,
      ...data.privateContent,
    }
    delete meta.markdown
  } else {
    meta = {
    ...data.publicContent
    }
  }
  const lessons = data.lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    order: lesson.order,
    complete: user ? isLessonComplete(data.id, lesson.id, user) : null,
    meta: {
      ...lesson.publicContent
    }
  }))
  return {
    status,
    course: {
      id: data.id,
      title: data.title,
      enrolled: isCourseEnrolled(data.id, user),
      nextLessonId: user ? getNextLessonId(lessons) : null,
      progress: user ? getProgress(lessons): null,
      lessons,
      meta,
      markdown,
      html,
    }
  }
}
