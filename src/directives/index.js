export const imgError = {
  inserted(el, options) {
    console.log(el)
    el.onerror = function() {
      el.src = options.value
    }
  }
}
export const focus = {
  inserted(el, options) {
    console.log(el)
    el.onerror = function() {
      el.src = options.value
    }
  }
}
