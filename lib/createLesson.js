import { isLessonComplete } from './helpers'
import markdownIt from 'markdown-it'
const md = markdownIt()

export default function ({ status, data }, courseId, user, api) {
  let html = null
  let markdown = null
  let complete = false
  let meta
  if (data.publicContent && data.publicContent.content) {
    html = md.render(data.publicContent.markdown)
    markdown = data.publicContent.markdown
  } else {
    if (status === 200) {
      html = md.render(data.privateContent.markdown)
      markdown = data.privateContent.markdown
    }
  }
  if (status === 200) {
    complete = user ? isLessonComplete(courseId, data.id, user) : false
  }
  meta = {
    ...data.publicContent,
    ...data.privateContent,
  }
  delete meta.markdown
  return {
    status,
    lesson: {
      id: data.id,
      title: data.title,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      meta,
      markdown,
      html,
      complete,
      async markComplete() {
        if (status === 200) {
          if (complete) {
            return true
          }
          return await api.setComplete(courseId, data.id, true, user)
        }
        return false
      },
      async markIncomplete() {
        if (status === 200) {
          if (!complete) {
            return true
          }
          return await api.setComplete(courseId, data.id, false, user)
        }
        return false
      }
    }
  }
}
