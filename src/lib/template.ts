/**
 * Fills {placeholders} in the combo-page template strings the editor controls.
 * Unknown placeholders are left alone rather than blanked, so a typo in the
 * admin shows up as visible text instead of a silent hole in the page.
 */
export const fillTemplate = (
  input: string | null | undefined,
  vars: Record<string, string | null | undefined>,
): string => {
  if (!input) return ''
  return input.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key]
    return value == null || value === '' ? match : value
  })
}
