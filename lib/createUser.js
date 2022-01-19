export default function ({ status, data }, baseUrl, schoolId) {
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
      loginRedirect(opts) {
        if (status !== 200) {
          opts.schoolId = schoolId
          const searchParams = new URLSearchParams(opts);
          window.location.href = `${baseUrl}/login?${searchParams.toString()}`
        } else {
          console.error('Already logged in.')
        }
      },
      logoutRedirect(opts) {
        if (status === 200) {
          opts.schoolId = schoolId
          const searchParams = new URLSearchParams(opts);
          window.location.href = `${baseUrl}/logout?${searchParams.toString()}`
        } else {
          return console.error('Already logged out.')
        }
      },
    }
  }
}
