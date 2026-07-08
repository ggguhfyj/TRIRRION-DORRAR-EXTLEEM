function getStableScore(word, index) {
  return [...`${word}-${index}`].reduce(
    (score, character) => score + character.charCodeAt(0),
    0,
  );
}

function HighlightedText({ searchTerm = '', text }) {
  const query = searchTerm.trim().toLowerCase();

  return text.split(/(\s+)/).map((part, index) => {
    const word = part.trim();
    const isSearchMatch =
      query.length > 0 && word.toLowerCase().includes(query);
    const shouldHighlight =
      word.length > 4 && getStableScore(word, index) % 7 === 0;
    const className = isSearchMatch
      ? 'search-highlight'
      : shouldHighlight
        ? 'yellow-highlight'
        : undefined;

    return (
      <span className={className} key={`${part}-${index}`}>
        {part}
      </span>
    );
  });
}

export default HighlightedText;
