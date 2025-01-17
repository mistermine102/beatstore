// utils/debounce.ts
function debounce(fn: Function, delay: number) {
  let timeout: ReturnType<typeof setTimeout>

  return function (...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
export default debounce
