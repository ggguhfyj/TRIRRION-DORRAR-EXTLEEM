import HighlightedText from './HighlightedText.jsx';

const heroText = [
  'In 1884, meridian time personnel met in Washington to change Earth time.',
  'First words said was that only 1 day could be used on Earth to not change the 1 day bible.',
  'So they applied the 1 day and ignored the other 3 days.',
  'The bible time was wrong then and it proved wrong today.',
  "This a major lie has so much evil feed from it's wrong.",
  "DOCTOR GENE RAY invested 30 years of HIS life and over 1/4 MILLION DOLLARS researching Nature's 4 - simultaneous 24 hour days within a single rotation of Earth.",
  "Religious/Academic word taught singularity is contradicted as evil lies by the simple math of the Cube's Opposite Corners - the most perfect symmetry within the Universe.",
  'Academic SINGULARITY is a contradiction to the opposite sexes, the opposite hemispheres and to the universe of opposites that exist as a zero value existence.',
  'The academic taught singularity/entity is but poison fed the human populace - slow death.',
  '*************************************************************************************************************'
  ,
].join(' ');

function Hero() {
  return (
    <section className="hero" id="home">
      <article>
        <h2>[CONSUME OUR CANNED GOODS]</h2>
        <p>
          <HighlightedText text={heroText} />
        </p>
      </article>
    </section>
  );
}

export default Hero;
