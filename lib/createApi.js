import fetch from 'cross-fetch'
import Cookie from "js-cookie";

function Response (status, data) {
  return { status, data }
}

let accessToken
let refreshToken

async function refresh(baseUrl) {
  const res = await fetch(
    `${baseUrl}/v1/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken
      })
    }
  )
  if (res.status === 200) {
    const data = await res.json()
    accessToken = data.access_token
    refreshToken = data.refresh_token
    const accessExpiry = new Date(new Date().getTime() + (3600 * 1000))
    const refreshExpiry = new Date(new Date().getTime() + (43200 * 60 * 1000))
    Cookie.set('access_token', accessToken, { expires: accessExpiry})
    Cookie.set('refresh_token', refreshToken, { expires: refreshExpiry })
  } else {
    accessToken = null
    refreshToken = null
    Cookie.remove('access_token')
    Cookie.remove('refresh_token')
  }
}

async function get(path, jsonOnUnauth = true, retries = 1) {
  const res = await fetch(
    path,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )
  if (res.status === 401 && refreshToken) {
    accessToken = Cookie.get('access_token')
    if (!accessToken && retries > 0) {
      retries--
      const url = new URL(path)
      await refresh(url.origin)
      return get(path, jsonOnUnauth, retries)
    }
  }
  const data = (res.status === 200 || jsonOnUnauth) ? await res.json() : null
  return Response(res.status, data)
}

export default function(baseUrl, tokens) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
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
    },
    async setComplete(courseId, lessonId, isComplete, user) {
      try {
        const response = await fetch(
          `${baseUrl}/courses/${courseId}/lessons/${lessonId}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
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
  }
}
