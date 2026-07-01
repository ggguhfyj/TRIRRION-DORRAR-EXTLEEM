# React Project Cheatsheet

This project started as plain `index.html` plus `styles.css`. It is now a Vite + React project, so most edits happen inside `src/`.

## Run The Project

Use the dev server instead of opening `index.html` directly.

```bash
cd "/mnt/c/Users/SamLowry/Desktop/project-paris/the actual thing"
npm run dev
```

Then open:

```text
http://localhost:5173/
```

If the browser does not update after edits:

```bash
Ctrl + Shift + R
```

If it is still stale, restart the server:

```bash
cd "/mnt/c/Users/SamLowry/Desktop/project-paris/the actual thing"
npm run dev
```

This project uses polling in `vite.config.js` because Windows-mounted folders under `/mnt/c/...` can miss file change events.

## Project Structure

```text
index.html
src/
  main.jsx
  App.jsx
  index.css
  components/
    Header.jsx
    Hero.jsx
    HighlightedText.jsx
    ArticleGrid.jsx
    ArticleCard.jsx
    Footer.jsx
```

What each file does:

```text
main.jsx          Starts React and mounts App into #root.
App.jsx           Assembles the page from components.
index.css         Main styling for the React app.
Header.jsx        Top title and Home/Politics/Campus nav.
Hero.jsx          Main blue section with red paragraph text.
HighlightedText.jsx  Procedurally highlights random-looking words.
ArticleGrid.jsx   Stores the bottom article data and maps it into cards.
ArticleCard.jsx   Reusable card component for each article.
Footer.jsx        Footer component, currently returns null.
```

## React Basics Used Here

React components are JavaScript functions that return JSX:

```jsx
function Header() {
  return <header>...</header>;
}

export default Header;
```

In JSX, use `className`, not `class`:

```jsx
<section className="hero">
```

Import a component before using it:

```jsx
import Header from './components/Header.jsx';

function App() {
  return <Header />;
}
```

## Building The Page From Components

The app is assembled in `App.jsx`:

```jsx
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ArticleGrid from './components/ArticleGrid.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="site-shell">
      <Header />
      <div className="content-frame">
        <div className="content-body">
          <main>
            <Hero />
            <ArticleGrid />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
```

## Making Reusable Article Cards

The data lives in `ArticleGrid.jsx`:

```jsx
const articles = [
  {
    section: 'politics',
    excerpt: 'Article text here.',
  },
  {
    section: 'campus',
    excerpt: 'More article text here.',
  },
  {
    section: 'ray',
    excerpt: 'Third article text here.',
  },
];
```

The grid loops over the data:

```jsx
{articles.map((article) => (
  <ArticleCard
    key={article.section}
    section={article.section}
    excerpt={article.excerpt}
  />
))}
```

The reusable card receives props:

```jsx
function ArticleCard({ excerpt, section }) {
  return (
    <article className="card" id={section} title="Read full article">
      <p>{excerpt}</p>
    </article>
  );
}
```

The `title="Read full article"` creates the browser tooltip on hover.

## Three Narrow Columns

The bottom articles become three columns with CSS Grid:

```css
.article-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}
```

Mobile switches back to one column:

```css
@media (max-width: 760px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}
```

## Yellow Border Around Hero And Green Content

The yellow frame comes from `.content-frame`. `Header` is outside this frame, so the yellow border does not wrap the `TRILLION DOLLAR EXTREME` title or nav.

```css
.content-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #fbff00;
  padding: clamp(10px, 2.2vmin, 24px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

The important parts:

```text
aspect-ratio: 1 / 1;    Makes the frame a perfect square.
width: 100%;            Uses the exact same width as the shell.
padding: ...;           Creates the visible yellow border.
overflow: hidden;       Keeps the inner layout inside the square.
```

The shared `--frame-size` variable below prevents the nav's yellow strip from being wider than the hero/green box.

`100svh` means full small viewport height. The custom property subtracts a header-sized chunk from the available height so the square can sit below the title/nav without overflowing.

## Centering A Square Website Layout

To keep the title/nav constrained but outside the yellow border, use a shell around both the header and square:

```css
#root {
  --frame-size: min(
    calc(100vw - clamp(16px, 4vmin, 40px)),
    calc(100svh - clamp(16px, 4vmin, 40px) - clamp(86px, 13vmin, 160px))
  );
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(8px, 2vmin, 20px);
}

.site-shell {
  width: var(--frame-size);
  max-height: calc(100svh - clamp(16px, 4vmin, 40px));
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.content-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-body {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
}

main {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
```

The header lives in `.site-shell`, but outside `.content-frame`. That keeps the title and nav aligned to the same centered width without giving them the yellow border.

Use `min-width: 0`, `max-width: 100%`, and `overflow: hidden` on inner layout pieces when children try to stretch wider than their parent:

```css
.site-header {
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

h1 {
  max-width: 100%;
  overflow-wrap: anywhere;
}
```

Then avoid viewport-height rules inside the square. For example, this was not good for a square layout:

```css
.hero {
  min-height: 53vh;
}
```

That makes the hero depend on the browser height instead of the square. Use flex instead:

```css
.hero {
  min-height: 0;
  flex: 1 1 72%;
}

.article-grid {
  min-height: 0;
  flex: 1 1 28%;
}
```

That means:

```text
Hero takes about 72% of the square height.
Article grid takes about 28% of the square height.
Both stay inside the yellow square.
```

If the text gets too large for the square, use:

```css
overflow: auto;
```

on the inner section that may need to scroll.

## Anchoring Hero Text Near The Blue/Green Border

Make the hero and its article use flexbox:

```css
.hero {
  display: flex;
  justify-content: center;
}

.hero article {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
```

Push the last hero paragraph down:

```css
.hero p:last-child {
  margin-top: auto;
  margin-bottom: 0;
}
```

## Making The Main Title Smaller

The title size is controlled by the `h1` rule:

```css
h1 {
  font-size: clamp(1.75rem, 4.8vw, 3.25rem);
}
```

The three `clamp()` values mean:

```text
minimum size, responsive size, maximum size
```

To make it smaller, lower the numbers:

```css
font-size: clamp(1.5rem, 4vw, 2.75rem);
```

## Making The Red Hero Text Bigger

The red paragraph text is controlled by `.hero p`:

```css
.hero p {
  color: rgb(214, 0, 0);
  font-size: clamp(1.2rem, 1.8vw, 1.9rem);
  line-height: 1.55;
  text-decoration: underline;
}
```

To make it bigger:

```css
font-size: clamp(1.4rem, 2vw, 2.2rem);
```

## Underlining Red Text

Add this to the red text rule:

```css
text-decoration: underline;
```

Example:

```css
.hero p {
  text-decoration: underline;
}
```

## Procedural Yellow Highlights In Text

The hero paragraph is stored as a string in `Hero.jsx`:

```jsx
const heroText = [
  'First sentence.',
  'Second sentence.',
].join(' ');
```

Then it is rendered with:

```jsx
<HighlightedText text={heroText} />
```

`HighlightedText.jsx` splits the text into words and wraps some words in:

```jsx
<span className="yellow-highlight">word</span>
```

The highlight choice is stable, not truly random, so the highlighted words do not jump around every render.

CSS for highlights:

```css
.yellow-highlight {
  background-color: #fbff00;
  color: rgb(214, 0, 0);
  padding: 0 0.12em;
}
```

## Avoid Duplicate IDs

IDs should be unique. For example, the hero already uses:

```jsx
<section className="hero" id="home">
```

So an article card should not also use `section: 'home'`. Use something unique:

```jsx
{
  section: 'ray',
  excerpt: '...',
}
```

## Common CSS Targets

```css
body              Whole page.
h1                Main TRILLION DOLLAR EXTREME title.
.menu             Yellow nav bar.
.content-frame    Yellow frame around the blue and green sections.
.hero             Blue section.
.hero h2          Hero heading.
.hero p           Red hero paragraph.
.yellow-highlight Yellow highlighted words inside red text.
.article-grid     Green article area.
.card             Each bottom text column.
.card p           Bottom green-section text.
```

## Build And Check

Use these when you want to verify the app is valid:

```bash
npm run build
npm run lint
```

Do not edit `dist/`. It is generated by `npm run build`.
