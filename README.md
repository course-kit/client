# CourseKit JavaScript Client

[![npm](https://img.shields.io/npm/v/@coursekit/client.svg?maxAge=3600)](https://www.npmjs.com/package/@coursekit/client)

[CourseKit](https://coursekit.dev/) is the easiest way to create a full-featured, custom online course, exactly how you want it. Use your favorite frontend tools - no server required!

This repo is for the CourseKit JavaScript Client which provides an easy way to access the CourseKit API.

## Installation

NPM:

```
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

| Option name | Required? | Type | Description |
|-|-|-|-|
| baseUrl | no | string | Changes the URL of the CourseKit API. |

### Methods



## LessonLoader class

# Other resources

- [CourseKit](https://coursekit.dev)
- [CourseKit demo](https://coursekit-nuxt-demo.netlify.app/)
- [Getting Started guide](https://github.com/course-kit/guides/blob/master/getting-started.md)
