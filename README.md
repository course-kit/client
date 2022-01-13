# CourseKit JavaScript Client

[![npm](https://img.shields.io/npm/v/@coursekit/client.svg?maxAge=3600)](https://www.npmjs.com/package/@coursekit/client)

[CourseKit](https://coursekit.dev/) is the easiest way to create a full-featured, custom online course, exactly how you want it. Use your favorite frontend tools - no server required!

This repo is for the *CourseKit JavaScript Client* which provides an easy way to access the features of the CourseKit API.

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

## UserLoader

The `UserLoader` class is used to create a `User` object.

```javascript
const { UserLoader } = require('@coursekit/client')
const userLoader = new UserLoader()
```

### Constructor

The constructor takes one parameter:

- `options?: object`. An optional object with the following options:

| Option name | Required? | Type | Description |
|-|-|-|-|
| baseUrl | no | string | Changes the URL of the CourseKit API. |

### Methods

#### `loadUser(): Promise<User>`

Loads the user's data from the API. The return object properties are:

- `status: number`. The status of API call to load the user.

| Status | Description |
|-|-|
| 200 | Successfully loaded |
| 401 | User is not authenticated |
| 500 | Error |

- `user: User`. An object which provides the data and methods you need to manage the user.

Example:

```javascript
const { status, user } = userLoader.loadUser()
if (status !== 200) {
  console.log(user.getName()) // null
} else {
  console.log(user.getName()) // Kilgore Trout
}
```

## User

The `User` object, returned from the `loadUser` method of `UserLoader`, provides an easy way to manage the user from the client.

### Methods

#### `login(opts: object): void`

Redirects the user to the login form. Note that you must supply an options object with either a `courseId` value or a `schoolId` value. This value will be used to determine where the user is redirected after login. If both values are provided, the `courseId` will be used.

Example:

```javascript
// Redirects to login form then to homepage of school
user.login({ schoolId: 'sc8gn2pl' })
```

| Option name | Required? | Type | Description |
|-|-|-|-|
| courseId | no | string | The ID of the course that the user should be redirected to after login.  |
| schoolId | no | string | The ID of the school that the user should be redirected to after login.  |

Will do nothing if the user is already logged in.

#### `logout(opts: object): void`

Logs out the user. Note that you must supply an options object with either a `courseId` value or a `schoolId` value. This value will be used to determine where the user is redirected after logout. If both values are provided, the `courseId` will be used.

| Option name | Required? | Type | Description |
|-|-|-|-|
| courseId | no | string | The ID of the course that the user should be redirected to after logout.  |
| schoolId | no | string | The ID of the school that the user should be redirected to after logout.  |

Will do nothing if the user is not logged in.

#### `isAuthenticated(): boolean`

Returns a boolean indicating whether or not the user is logged in.

#### `getName(): string | null`

Returns the user's name as a string or null if the user is not logged in.

#### `markComplete(courseId: string, lessonId: string): Promise<boolean>`

Asynchronous method that marks a specified lesson of a course as complete. Returns a promise that resolves to a boolean indicating success. Always returns false if user is not logged in.

#### `markIncomplete(courseId: string, lessonId: string): Promise<boolean>`

Asynchronous method that marks a specified lesson of a course as incomplete. Returns a promise that resolves to a boolean indicating success or failure. Always returns false if user is not logged in.

#### `isLessonComplete(courseId: string, lessonId: string): boolean | null`

Returns a boolean indiciating whether or not a user has marked a specified lesson of a course as complete. Returns null if user is not logged in.

#### `isCourseEnrolled(courseId: string): boolean | null`

Returns a boolean indicating whether or not a user is enrolled in a specified course.  Returns null if user is not logged in.

#### `getNextLessonId(courseId: string): string | null`

Returns the lesson ID of the next incomplete lesson of a specified course or null if the user is not logged in.

#### `getProgress(courseId: string): float | null`

Returns a number between 0 and 1 with decimal points indicating the amount of the specified course that is complete. For example, in a 4 lesson course if 1 lesson is complete this method would return `0.25`.

Returns null if the user is not logged in.

## LessonLoader

The `LessonLoader` class is used to load lesson content.

```javascript
const { LessonLoader } = require('@coursekit/client')
const lessonLoader = new LessonLoader(courseId, lessonId)
```

### Constructor

The constructor takes three parameters:

- `courseId: string`. The ID of the course.
- `lessonId: string`. The ID of the lesson.
- `options?: object`. An optional object with the following options:

| Option name | Required? | Type | Description |
|-|-|-|-|
| baseUrl | no | string | Changes the URL of the CourseKit API. |

### Methods

#### `loadPlayer(targetSelector: string, opts?: object) : Promise<object>`

In order to display your lesson video in your site the `loadPlayer` method will embed an HTML5 video player into your page. It also returns a `Player` object which provides method and events that allow your site to interface programmatically with the player.

You will need to elect a "mount element" in your page where the player will be dynamically embedded. e.g.

```html
<!--Mount element where video player will be embedded-->
<div id="video"></div>
```

The parameters are:

- `targetSelector: string | Element` a CSS selector targeting the DOM element in which you want to create the player (eg. "#target"), or the DOM element itself
- `opts?: object`. an object containing the player options. The available options are:

| Option name | Required? | Type | Description |
|-|-|-|-|
| autoplay | no (default: false) | boolean | start playing the video as soon as it is loaded | 
| hideControls | no (default: false) | boolean | the controls are hidden |
| showSubtitles | no (default: false) | boolean | the video subtitles are shown by default |

The return object properties are:

- `status: number`. The status of API call to load the lesson's video.

| Status | Description |
|-|-|
| 200 | Successfully loaded |
| 401 | User is not authenticated |
| 403 | User is authenticated but does not have access to this lesson |
| 500 | Error |


- `player: Player | null`. An instance of the `Player` object which provides methods and events allowing you to control the video player with JavaScript. Note that the player will be `null` if the status is not `200`.

Example:

```javascript
const { status, player } = await lessonLoader.loadPlayer('#video')

if (status !== 200) {
  // player === null
} else {
  player.addEventListener('play', console.log('Video is playing!'))
}
```

#### `loadContent() : Promise<Content>`

Loads private content from the Lesson API.

The `Content` object properties are:

- `status: number`. The status of API call to load the lesson's content.

| Status | Description |
|-|-|
| 200 | Successfully loaded |
| 401 | User is not authenticated |
| 403 | User is authenticated but does not have access to this lesson |
| 500 | Error |

- `content: string | null`. The content string or null if the API call was not successful.

Example:

```javascript
const { status, content } = await lessonLoader.loadContent()

if (status !== 200) {
  // content === null
} else {
  console.log(content) // This is private lesson content!
}
```

## Player

This object is returned from the `loadPlayer` method of the `LessonLoader`. The object is an instance of the [api.video PlayerSDK class](https://github.com/apivideo/api.video-player-sdk#documentation).

### Methods and events

Since the `Player` object is an instance of the of the api.video PlayerSDK, you should check the [documentation of the PlayerSDK methods](https://github.com/apivideo/api.video-player-sdk/blob/master/README.md#methods) for information about methods and events.

## Usage tips and examples

### Accessing resource IDs

Note that you'll need to be able to access the school ID, course IDs, and lesson IDs in your app so that you can request the relevant resources. These are all public values so feel free to hardcode these. 

One strategy that's effective for static sites and single page apps is to hardcode the school ID directly in your code, e.g. `const schoolId = 'scx7fdv32m'`, and generate page routes with the course and lesson IDs as dynamic segments.

For example, your lesson page may be `/courses/:courseid/lessons/:lessonid`. Now, it's trivial to retrieve the course ID and lesson IDs at runtime.

```javascript
const segments = window.location.pathname.split('/')
const courseId = segments[segments.length - 3]
const lessonId = segments[segments.length - 1]
```

### Loading user

This code will load the user from API and should be run ASAP.

```javascript
const { UserLoader } = require('@coursekit/client')
const userLoader = new UserLoader()
const { status, user } = await userLoader.loadUser()
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

#### "Complete lesson and continue" button

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

### Loading lesson content

...


```javascript
const { LessonLoader } = require('@coursekit/client')
const MarkdownIt = require('markdown-it')

const lessonLoader = new LessonLoader()
const { status, content } = await lessonLoader.loadContent()
const md = new MarkdownIt()

const display = document.querySelector('#display')

if (status === 200) {
  display.innerHTML = md.render(content);
}
if (status === 401) {
  display.innerHTML = 'You\'ll need to log in or enroll to access this lesson.'
}
if (status === 403) {
  display.innerHTML = 'You\'ll need to enroll to access this lesson.'
}
if (status === 500) {
  display.innerHTML = 'There was an error loading this lesson, try again later.'
}
```

### Video

TBA

## Resources

- [CourseKit](https://coursekit.dev)
- [CourseKit Nuxt demo](https://github.com/course-kit/nuxt-demo)
- [Getting Started guide](https://github.com/course-kit/guides/blob/master/getting-started.md)
