// Discord: **
const boldText = (text: string) => `*${text}*`;

// Discord: *
const italicText = (text: string) => `_${text}_`;

const boldAndItalicText = (text: string) => boldText(italicText(text));

export { boldText, italicText, boldAndItalicText };
