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

function isLessonComplete(courseId, lessonId, user) {
  const course = user.courses.find(course => course.id === courseId)
  if (course) {
    const lesson = course.lessons.find(lesson => lesson.id === lessonId)
    if (lesson) {
      return lesson.complete
    }
  }
}

function parseContent(content) {
  content.html = md.render(content.markdown)
  return content
}

export default function ({ status, data }, courseId, user, baseUrl) {
  const privateContent = status === 200 ? parseContent(data.privateContent) : {}
  const complete = status === 200 ? isLessonComplete(courseId, data.id, user) : false
  return {
    status,
    lesson: {
      id: data.id,
      title: data.title,
      order: data.order,
      ...data.publicContent,
      ...privateContent,
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
