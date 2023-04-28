import Cookie from "js-cookie";
import fetch from "cross-fetch";

export default function ({ status, data }, baseUrl, schoolId, devMode) {
  return {
    status,
    user: {
      isAuthenticated() {
        return status === 200
      },
      getName() {
        return data
          ? data.name
          : null
      },
      loginRedirect(opts = {}) {
        if (status !== 200) {
          opts.schoolId = schoolId
          opts.devMode = devMode
          const searchParams = new URLSearchParams(opts);
          window.location.href = `${baseUrl}/login?${searchParams.toString()}`
        } else {
          console.error('Already logged in.')
        }
      },
      async requestLoginLink(email, opts = {}) {
        if (status !== 200) {
          await fetch(
            `${baseUrl}/login`,
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                courseId: opts.courseId,
                email,
                schoolId,
                devMode
              })
            }
          )
        } else {
          console.error('Already logged in.')
        }
      },
      logoutRedirect(opts = {}) {
        if (status === 200) {
          Cookie.remove('access_token')
          Cookie.remove('refresh_token')
          opts.schoolId = schoolId
          opts.devMode = devMode
          const searchParams = new URLSearchParams(opts)
          window.location.href = `${baseUrl}/logout?${searchParams.toString()}`
        } else {
          return console.error('Already logged out.')
        }
      },
      enrollRedirect(courseId, name = null, email = null) {
        if (!courseId) {
          return console.error('Course ID must be supplied.')
        }
        const searchParams = new URLSearchParams({ courseId,
          name,
          email,
          schoolId,
          devMode
        })

        if (email) {
          window.location.href =`${baseUrl}/passwordlessEnroll?${searchParams.toString()}`
        } else {
          window.location.href =`${baseUrl}/enroll?${searchParams.toString()}`
        }
      },
    }
  }
}
