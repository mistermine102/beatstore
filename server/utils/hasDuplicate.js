function hasDuplicate(values) {
  return new Set(values).size !== values.length
}

export default hasDuplicate
