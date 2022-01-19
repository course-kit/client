function isCourseEnrolled(courseId, user) {
  if (!user) {
    return null
  } else {
    return !!user.courses.find(course => course.id === courseId)
  }
}

function getNextLessonId(lessons) {
  const lesson = lessons.find(lesson => !lesson.complete)
  return lesson.id
}

function getProgress(lessons) {
  const complete = lessons.filter(lesson => lesson.complete)
  return Math.round(100 * complete.length / lessons.length) / 100
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

export { getProgress, getNextLessonId, isCourseEnrolled, isLessonComplete }
