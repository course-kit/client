import { isLessonComplete } from './helpers'
import markdownIt from 'markdown-it'
const md = markdownIt()

async function setComplete(courseId, lessonId, isComplete, user, baseUrl) {
  try {
    const response = await fetch(
      `${baseUrl}/courses/${courseId}/lessons/${lessonId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ complete: isComplete })
      }
    )
    if (response.status === 200) {
      const course = user.courses.find(course => course.id === courseId)
      const lesson = course.lessons.find(lesson => lesson.id === lessonId)
      lesson.complete = isComplete
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    return { status: 500 }
  }
}

export default function ({ status, data }, courseId, user, baseUrl) {
  let html = null
  let markdown = null
  let complete = false
  let meta
  if (status === 200) {
    html = md.render(data.privateContent.markdown)
    markdown = data.privateContent.markdown
    complete = isLessonComplete(courseId, data.id, user)
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
  return {
    status,
    lesson: {
      id: data.id,
      title: data.title,
      order: data.order,
      meta,
      markdown,
      html,
      complete,
      async markComplete() {
        if (status === 200) {
          if (complete) {
            return true
          }
          return await setComplete(courseId, data.id, true, user, baseUrl)
        }
        return false
      },
      async markIncomplete() {
        if (status === 200) {
          if (!complete) {
            return true
          }
          return await setComplete(courseId, data.id, true, user, baseUrl)
        }
        return false
      }
    }
  }
}
