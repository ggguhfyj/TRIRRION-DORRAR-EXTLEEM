function ArticleCard({ excerpt, section }) {
  return (
    <article className="card" id={section} title="Read full article">
      <p>
        <span className="card-highlight">{excerpt}</span>
      </p>
    </article>
  );
}

export default ArticleCard;
