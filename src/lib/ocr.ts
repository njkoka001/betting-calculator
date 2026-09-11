/**
 * Parses OCR recognized text string from a WhatsApp Status screenshot
 * and extracts the likely view count integer.
 */
export function extractViewsFromText(text: string): number {
  if (!text) return 0

  const lower = text.toLowerCase()

  // Pattern 1: "137 views", "137 view", "seen by 137", "viewed by 137"
  const viewRegex = /(\d+)\s*(views?|seen|viewed)/i
  const match1 = lower.match(viewRegex)
  if (match1 && match1[1]) {
    return parseInt(match1[1], 10)
  }

  // Pattern 2: "views: 137" or "seen by: 137"
  const viewPrefixRegex = /(views?|seen by|viewed by)\s*:\s*(\d+)/i
  const match2 = lower.match(viewPrefixRegex)
  if (match2 && match2[2]) {
    return parseInt(match2[2], 10)
  }

  // Pattern 3: Look for standalone numbers in line
  const numbers = text.match(/\b\d{1,5}\b/g)
  if (numbers && numbers.length > 0) {
    // Return highest reasonable number under 50,000
    const valid = numbers
      .map((n) => parseInt(n, 10))
      .filter((n) => n > 0 && n < 50000)
    if (valid.length > 0) {
      return Math.max(...valid)
    }
  }

  return 0
}
