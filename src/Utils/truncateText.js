export default function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text

  const shortened = text.slice(0, maxLength)
  const lastSpaceIndex = shortened.lastIndexOf(' ')

  return `${shortened.slice(0, lastSpaceIndex)}...`
}
