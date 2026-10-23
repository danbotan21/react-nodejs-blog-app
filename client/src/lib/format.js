export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// "Do this. Then that." -> ['Do this.', 'Then that.'] (one step per line or sentence)
export const toSteps = (text) =>
  text
    .split(/\n+|(?<=\.)\s+(?=[A-Z])/)
    .map((step) => step.trim())
    .filter(Boolean)

export const readingTime = (post) => {
  const words = `${post.description} ${post.benefits} ${post.howToPrepare}`.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
