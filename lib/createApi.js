import fetch from 'cross-fetch'

function Response (status, data) {
  return { status, data }
}

async function get(path, jsonOnUnauth = true) {
  const res = await fetch(
    path,
    {
      method: 'GET',
      credentials: 'include'
    }
  )
  const data = (res.status === 200 || jsonOnUnauth) ? await res.json() : null
  return Response(res.status, data)
}

export default function(baseUrl) {
  return {
    async loadUser() {
      return get(`${baseUrl}/user`, false)
    },
    async loadCourses (schoolId) {
      return get(`${baseUrl}/schools/${schoolId}`)
    },
    async loadCourse (courseId) {
      return get(`${baseUrl}/courses/${courseId}`)
    },
    async loadLesson (courseId, lessonId) {
      return get(`${baseUrl}/courses/${courseId}/lessons/${lessonId}`)
    }
  }
}
