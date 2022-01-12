# CourseKit JavaScript Client

[![npm](https://img.shields.io/npm/v/@coursekit/client.svg?maxAge=3600)](https://www.npmjs.com/package/@coursekit/client)

[CourseKit](https://coursekit.dev/) is the easiest way to create a full-featured, custom online course, exactly how you want it. Use your favorite frontend tools - no server required!

This repo is for the CourseKit JavaScript Client which provides an easy way to access the CourseKit API.

## Installation

NPM:

```bash
npm install --save @coursekit/client
```

There are two classes you can use from this library, `LessonLoader` and `UserLoader`. Both an ES Modules and CommonJS build are provided.

ESM:

```javascript
import { LessonLoader, UserLoader } from '@coursekit/client'
```

CJS:

```javascript
const { LessonLoader, UserLoader } = require('@coursekit/client')
```

## UserLoader class

The `UserLoader` class provides easy access to the CourseKit User API.

```javascript
const { UserLoader } = require('@coursekit/client')
const userLoader = new UserLoader()
```

### Constructor

The constructor takes one parameter:

- `options : object`. An optional object with the following options:

| Option name | Required? | Type | Description |
|-|-|-|-|
| baseUrl | no | string | Changes the URL of the CourseKit API. |

### Methods

#### `loadUser() : Promise<User>`

Loads the user's data from the API. Returns a `User` object which provides the data and methods you need to manage the user.

## User object

### Methods

#### `isAuthenticated()`

#### `getName()`

#### `login(opts)`

#### `logout(opts)`

#### `markComplete(courseId, lessonId)`

#### `markIncomplete(courseId, lessonId)`

#### `isLessonComplete(courseId, lessonId)`

#### `isCourseEnrolled(courseId, lessonId)`

#### `getNextLessonId(courseId)`

#### `getProgress(courseId)`

## LessonLoader class

The `LessonLoader` class provides easy access to the CourseKit Lesson API.

```javascript
const { LessonLoader } = require('@coursekit/client')
const lessonLoader = new LessonLoader(course.id, lesson.id)
```

### Constructor

The constructor takes three parameters:

- `courseId : string`.
- `lessonId : string`.
- `options : object`. An optional object with the following options:

| Option name | Required? | Type | Description |
|-|-|-|-|
| baseUrl | no | string | Changes the URL of the CourseKit API. |

### Methods

#### `loadPlayer(targetSelector : string, playerOptions : object) : Promise<Player>`

#### `loadContent() : Promise<Content>`

## Player object

## Content object

## Examples

### Accessing resource IDs

Note that you'll need to be able to access the school ID, course IDs, and lesson IDs in your app so that you can request the relevant resources. These are all public values so feel free to hardcode these. 

One strategy that's effective for static sites and single page apps is to hardcode the school ID directly in your code, e.g. `const schoolId = 'scx7fdv32m'`, and generate page routes with the course and lesson IDs as dynamic segments.

For example, your lesson page may be `/courses/:courseid/lessons/:lessonid`. Now, it's trivial to retrieve the course ID and lesson IDs at runtime.

```javascript
const segments = window.location.pathname.split('/')
const courseId = segments[segments.length - 3]
const lessonId = segments[segments.length - 1]
```

### UserLoader

This code will load the user from API and should be run ASAP.

```javascript
const { UserLoader } = require('@coursekit/client')
const userLoader = new UserLoader(opts)
const { user } = await userLoader.loadUser()
```

#### Log in/out button

Put an HTML button somewhere on your page (e.g. in the nav bar) where a user can log in or out.

```javascript
const button = document.querySelector('#login-button')
if (user.isAuthenticated()) {
  button.innerText = 'Log out'
  button.addEventListener('click', user.logout({ schoolId }))
} else {
  button.innerText = 'Log in'
  button.addEventListener('click', user.login({ schoolId }))
}
```

#### 'Complete lesson and continue' button

On your lesson page you probably would include a button that will allow the user to simultaneously mark the current lesson complete and progress to the next one.

```javascript
const button = document.querySelector('#complete-button')
if (user.isAuthenticated()) {
  button.addEventListener('click', async () => {
    const success = await user.markComplete(courseId, lessonId)
    if (success) {
      const nextLessonId = await user.getNextLessonId(courseId)
      window.location.href = `/courses/${courseId}/lessons/${nextLessonId}`
    }
  })
}
```

### Content

### Video

## Resources

- [CourseKit](https://coursekit.dev)
- [CourseKit Nuxt demo](https://github.com/course-kit/nuxt-demo)
- [Getting Started guide](https://github.com/course-kit/guides/blob/master/getting-started.md)
