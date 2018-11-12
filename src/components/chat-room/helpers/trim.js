export const trim = function trim(time) {
  // grep timezone from timestring, including parens,
  // capture group 1 is timezone without parens
  const re = /\(([^)]+)\)/i
  const matchGroups = time.match(re);
  const timezone = matchGroups[1];
  let abbr = timezone
  // if timezone contains word-boundary letters, abbreviate it
  if (timezone.search(/\W/) >= 0) {
    abbr = timezone
      .match(/\b\w/g)
      .join("")
      .toUpperCase()
  }
  return time.replace(re, `(${abbr})`)
}
