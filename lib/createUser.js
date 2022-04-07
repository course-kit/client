import Cookie from "js-cookie";

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
    }
  }
}
