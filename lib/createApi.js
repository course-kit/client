import fetch from 'cross-fetch'
import {tokenSet, tokenGet, tokenRemove} from "./authTokens";

function Response (status, data) {
  return { status, data }
}

let accessToken
let refreshToken

async function refresh(baseUrl, authSessionStorage) {
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
    tokenSet('access_token', accessToken, { expires: accessExpiry}, !authSessionStorage)
    tokenSet('refresh_token', refreshToken, { expires: refreshExpiry }, !authSessionStorage)
  } else {
    accessToken = null
    refreshToken = null
    tokenRemove('access_token', !authSessionStorage)
    tokenRemove('refresh_token', !authSessionStorage)
  }
}

async function get(path, jsonOnUnauth = true, retries = 1, authSessionStorage) {
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
    accessToken = tokenGet('access_token', !authSessionStorage)
    if (!accessToken && retries > 0) {
      retries--
      const url = new URL(path)
      await refresh(url.origin, authSessionStorage)
      return get(path, jsonOnUnauth, retries, authSessionStorage)
    }
  }
  const data = (res.status === 200 || jsonOnUnauth) ? await res.json() : null
  return Response(res.status, data)
}

/**
 * This function checks if the item (course or lesson) is published.
 * We assume status is a property of the publicContent object.
 * However, not all courses will use this property, so we assume the item is published
 * if no status property can be found.
 * @param obj
 * @returns {boolean}
 */
function isPublished(obj) {
  if (obj?.publicContent?.status) {
    return obj.publicContent.status === "published"
  }
  return true
}

export default function createApi(baseUrl, tokens, devMode, authSessionStorage = false) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  return {
    async loadUser() {
      return get(`${baseUrl}/user`, false, 1, authSessionStorage)
    },
    async loadCourses (schoolId) {
      const res = await get(`${baseUrl}/schools/${schoolId}`, true, 1, authSessionStorage)
      return {
        status: res.status,
        data: res.data.filter(course => devMode ? true : isPublished(course))
      }
    },
    async loadCourse (courseId) {
      const res = await get(`${baseUrl}/courses/${courseId}`, true, 1, authSessionStorage)
      if (devMode ? true : isPublished(res.data)) {
        const data = { ...res.data }
        data.lessons = data.lessons.filter(lesson => devMode ? true : isPublished(lesson))
        return {
          status: res.status,
          data
        }
      } else {
        return {
          status: 404,
          data: null
        }
      }
    },
    async loadLesson (courseId, lessonId) {
      const res = await get(`${baseUrl}/courses/${courseId}/lessons/${lessonId}`, true, 1, authSessionStorage)
      if (devMode ? true : isPublished(res.data)) {
        return res
      } else {
        return {
          status: 404,
          data: null
        }
      }
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
        );
        if (response.status === 200) {
          const course = user.courses.find(course => course.id === courseId);
          const lesson = course.lessons.find(lesson => lesson.id === lessonId);
          lesson.complete = isComplete;
          return true
        } else {
          return false
        }
      } catch (err) {
        console.log(err);
        return { status: 500 }
      }
    }
  }
}
