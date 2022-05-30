const stringGenerator = () => {
  const randomHash1 = Math.random().toString(36).substring(2, 10)
  const randomHash2 = Math.random().toString(36).substring(2, 6)
  const randomHash3 = Math.random().toString(36).substring(2, 6)
  const randomHash4 = Math.random().toString(36).substring(2, 6)
  const randomHash5 = Math.random().toString(36).substring(2, 10)

  const newString = [randomHash1, randomHash2, randomHash3, randomHash4, randomHash5].join('-')

  const newDate = new Date()

  const result = [newDate.toISOString(), newString].join(': ')

  return result
}

module.exports = stringGenerator
