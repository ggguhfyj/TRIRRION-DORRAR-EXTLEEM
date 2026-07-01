function getStableScore(word, index) {
  return [...`${word}-${index}`].reduce(
    (score, character) => score + character.charCodeAt(0),
    0,
  );
}

function HighlightedText({ text }) {
  return text.split(/(\s+)/).map((part, index) => {
    const word = part.trim();
    const shouldHighlight =
      word.length > 4 && getStableScore(word, index) % 7 === 0;

    return (
      <span
        className={shouldHighlight ? 'yellow-highlight' : undefined}
        key={`${part}-${index}`}
      >
        {part}
      </span>
    );
  });
}

export default HighlightedText;
