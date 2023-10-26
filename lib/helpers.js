function isCourseEnrolled(courseId, user) {
  if (!user) {
    return null
  } else {
    return !!user.courses.find(course => course.id === courseId)
  }
}

function getNextLesson(currentLessonId, lessons) {
  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === currentLessonId)
  if (currentLessonIndex === -1 || currentLessonIndex === lessons.length - 1) {
    return null
  }
  return lessons[currentLessonIndex + 1]
}

function getPreviousLesson(currentLessonId, lessons) {
  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === currentLessonId)
  if (currentLessonIndex === -1 || currentLessonIndex === 0) {
    return null
  }
  return lessons[currentLessonIndex - 1]
}

function getNextIncompleteLesson(lessons) {
  return lessons.find(lesson => !lesson.complete)
}

function getProgress(lessons) {
  if (lessons.length === 0) {
    return 1
  }
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

function getCompletedAt(courseId, lessonId, user) {
  const course = user.courses.find(course => course.id === courseId)
  if (course) {
    const lesson = course.lessons.find(lesson => lesson.id === lessonId)
    if (lesson) {
      return lesson.completedAt
    }
  }
}

export { getProgress, getNextIncompleteLesson, isCourseEnrolled, isLessonComplete, getNextLesson, getPreviousLesson, getCompletedAt }
