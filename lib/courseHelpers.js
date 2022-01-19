function isCourseEnrolled(courseId, user) {
  if (!user || user.status !== 200) {
    return null
  } else {
    return !!user.courses.find(course => course.id === courseId)
  }
}

function getNextLessonId(courseId, user) {
  if (user && user.status === 200) {
    const course = user.courses.find(course => course.id === courseId)
    if (course) {
      const lesson = course.lessons.find(lesson => !lesson.complete)
      return lesson.id
    }
  }
  return null
}

function getProgress(courseId, user) {
  if (user && user.status === 200) {
    const course = user.courses.find(course => course.id === courseId)
    if (course) {
      const complete = course.lessons.filter(lesson => lesson.complete)
      return Math.round(100 * complete.length / course.lessons.length) / 100
    }
  }
  return null
}

export { getProgress, getNextLessonId, isCourseEnrolled }
