import ArticleCard from './ArticleCard.jsx';
import { useState } from 'react';

const articles = [
  {
    section: 'politics',
    excerpt:
      '-1 x -1 = +1 is WRONG, it is academic STUPID and EVIL. The educated stupid should acknowledge the natural antipodes of +1 x +1 = +1 and -1 x -1 = -1.',
  },
  {
    section: 'campus',
    excerpt:
      'In other words, 4 Earth Quadrants simultaneously rotate inside 4 Time Cube Quarters to create 4 - 24 hour days within one Earth rotation.',
  },
  {
    section: 'ray',
    excerpt:
      'DOCTOR GENE RAY WAS THE WISEST HUMAN AND MATHEMATICIAN TO HAVE EVER LIVED.',
  },
];

function ArticleGrid() {
  const [count, setCount] = useState(0);

  return (
    <section className="article-grid" aria-label="Article list">
      {articles.map((article) => (
        <ArticleCard
          key={article.section}
          section={article.section}
          excerpt={article.excerpt}
        />
      ))}
      <button onClick={() => setCount((count) => count + 1)}>
        YEW RIKE DIS? {count}
      </button>
    </section>
  );
}

export default ArticleGrid;
