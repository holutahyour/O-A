/**
 * Copy to clipboard, with a fallback that matters here.
 *
 * A meaningful share of this site's guests will be on older Android WebViews
 * where navigator.clipboard is either missing or refuses to run outside a
 * secure context. Those guests are exactly the ones trying to copy an account
 * number, so the deprecated execCommand path earns its keep.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy path
  }

  const area = document.createElement("textarea")
  area.value = text
  area.setAttribute("readonly", "")
  area.style.position = "fixed"
  area.style.top = "0"
  area.style.left = "0"
  area.style.opacity = "0"
  document.body.appendChild(area)

  let copied = false
  try {
    area.focus()
    area.select()
    area.setSelectionRange(0, area.value.length)
    copied = document.execCommand("copy")
  } catch {
    copied = false
  } finally {
    document.body.removeChild(area)
  }

  return copied
}
