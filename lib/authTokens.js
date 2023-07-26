import Cookie from "js-cookie";

export function tokenSet(name, value, opts, isCookie = true) {
  if (isCookie) {
    return Cookie.set(name, value, opts)
  } else {
    return sessionStorage.setItem(name, value)
  }
}

export function tokenGet(name, isCookie = true) {
  if (isCookie) {
    return Cookie.get(name)
  } else {
    return sessionStorage.getItem(name)
  }
}

export function tokenRemove(name, isCookie = true) {
  if (isCookie) {
    return Cookie.remove(name)
  } else {
    return sessionStorage.removeItem(name)
  }
}
