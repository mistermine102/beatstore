function useToggleProperty() {
  function toggleProperty(source: any, toggledProperty: string, totalProperty: string) {
    if (!source[toggledProperty]) {
      source[toggledProperty] = true
      source[totalProperty]++
    } else {
      source[toggledProperty] = false
      source[totalProperty]--
    }
  }

  return toggleProperty
}

export default useToggleProperty
