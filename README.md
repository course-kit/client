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

### Content

### Video

## Resources

- [CourseKit](https://coursekit.dev)
- [CourseKit Nuxt demo](https://github.com/course-kit/nuxt-demo)
- [Getting Started guide](https://github.com/course-kit/guides/blob/master/getting-started.md)
