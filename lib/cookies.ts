import Cookies from "js-cookie"

// 쿠키 설정 함수
export function setCookie(name: string, value: string | boolean | object, options = {}) {
  if (typeof value === "object") {
    Cookies.set(name, JSON.stringify(value), options)
  } else {
    Cookies.set(name, String(value), options)
  }
}

// 쿠키 가져오기 함수
export function getCookie(name: string) {
  const value = Cookies.get(name)
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

// 쿠키 삭제 함수
export function removeCookie(name: string) {
  Cookies.remove(name)
}
