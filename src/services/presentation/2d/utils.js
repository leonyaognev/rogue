export function colorChar(char, fg = "white", bg = null) {
  let result = `{${fg}-fg}`;
  if (bg) result += `{${bg}-bg}`;
  result += char;
  if (bg) result += `{/${bg}-bg}`;
  result += `{/${fg}-fg}`;
  return result;
}
