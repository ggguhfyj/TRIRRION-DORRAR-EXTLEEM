# React And Backend Project

This project keeps the original square neon React website design and adds a separate Node/Express backend API. The frontend is still mostly the same visual website, with one small extra feature: a search bar inside the hero section that highlights matching words in the hero text.

## What Changed

I added a backend server in `server.js`.

That server uses Express to create API routes. An API route is a URL that sends or receives data instead of showing a webpage. For example:

```text
http://localhost:3000/api/articles
```

I added `articles.json` as a tiny file database.

The backend reads and writes this file so article data can stay saved after refreshes. It is not a real production database, but it is perfect for learning backend basics.

I added backend scripts to `package.json`.

```json
{
  "api": "node server.js",
  "server": "node server.js",
  "start": "node server.js"
}
```

These scripts let you start the API with:

```powershell
npm run api
```

I added a search bar to `src/components/Hero.jsx`.

The search bar stores what you type in React state, counts how many hero words match it, and passes the search term into `HighlightedText.jsx`.

I fixed the hero text formatting.

The long hero text must be written as JavaScript strings. That means each line in the array needs quotes around it:

```jsx
const heroText = [
  'First line of text.',
  'Second line of text.',
].join(' ');
```

Without the quotes, JavaScript tries to read the text as code and the app breaks.

I made the hero paragraph text larger in `src/index.css`.

The main rule is:

```css
.hero p {
  font-size: clamp(1.15rem, 2.15vmin, 2.35rem);
}
```

`clamp()` means the text has a minimum size, a flexible middle size, and a maximum size.

## Run The Project

You need two terminals.

In the first terminal, start the backend:

```powershell
npm run api
```

The API runs here:

```text
http://localhost:3000
```

In the second terminal, start the React website:

```powershell
npm run dev
```

Open the site here:

```text
http://localhost:5173/
```

## Backend Files

`server.js` is the backend server.

It does these jobs:

- Starts an Express app
- Allows JSON request bodies with `express.json()`
- Allows frontend requests with `cors()`
- Reads article data from `articles.json`
- Writes article data back to `articles.json`
- Creates GET, POST, PATCH, and DELETE routes

`articles.json` is the saved article data.

Each article looks like this:

```json
{
  "id": 1,
  "title": "Campus Life Returns to Normal",
  "excerpt": "Students are finally getting some rest...",
  "author": "Jane Doe",
  "likes": 5
}
```

`package.json` stores the commands and dependencies.

The important backend dependencies are:

```text
express  Creates the server and routes
cors     Lets the React dev server call the API
```

## API Endpoints

The backend stores articles in `articles.json`.

```text
GET    /api/articles       List every article
GET    /api/articles/:id   Read one article by id
POST   /api/articles       Publish a new article
PATCH  /api/articles/:id   Update article fields or likes
DELETE /api/articles/:id   Delete one article
```

Example `POST /api/articles` body:

```json
{
  "title": "Epitech Summer School is a massive success",
  "excerpt": "Students build full-stack APIs in record time.",
  "author": "Jane Doe"
}
```

The server automatically adds:

```json
{
  "id": 2,
  "likes": 0
}
```

## How The Backend Works

The server starts with imports:

```js
import cors from 'cors';
import express from 'express';
import { readFile, writeFile } from 'node:fs/promises';
```

`express` creates the API.

`cors` lets the React site at port `5173` talk to the backend at port `3000`.

`readFile` and `writeFile` let the server use `articles.json` like a simple database.

The `readArticles()` function opens `articles.json` and converts the JSON text into a JavaScript array:

```js
const file = await readFile(articlesPath, 'utf8');
const articles = JSON.parse(file);
```

The `writeArticles()` function converts the JavaScript array back into JSON text and saves it:

```js
await writeFile(articlesPath, `${JSON.stringify(articles, null, 2)}\n`);
```

The GET route sends all articles:

```js
app.get('/api/articles', async (request, response) => {
  const articles = await readArticles();
  response.status(200).json(articles);
});
```

The POST route creates a new article:

```js
app.post('/api/articles', async (request, response) => {
  const title = cleanText(request.body.title);
  const excerpt = cleanText(request.body.excerpt);
  const author = cleanText(request.body.author);
});
```

It checks that the title, excerpt, and author exist. Then it creates an id, sets likes to `0`, saves the new article, and returns `201 Created`.

The PATCH route updates an existing article.

This is useful for changing the title, excerpt, author, or likes.

The DELETE route removes an article.

This is optional for the assignment, but it is included as a bonus endpoint.

## How To Test The Backend

Start the backend:

```powershell
npm run api
```

Open this URL in your browser:

```text
http://localhost:3000/api/articles
```

You should see JSON article data.

You can also test with PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/articles" -Method Get
```

To test POST in Postman:

1. Set the method to `POST`
2. Use this URL: `http://localhost:3000/api/articles`
3. Go to Body
4. Choose raw
5. Choose JSON
6. Send this:

```json
{
  "title": "New Story",
  "excerpt": "This was published through the API.",
  "author": "Student Reporter"
}
```

## Frontend Search Feature

The search feature is in `src/components/Hero.jsx`.

It uses React state:

```jsx
const [searchTerm, setSearchTerm] = useState('');
```

That means React remembers whatever the user types.

The input updates that state:

```jsx
<input
  onChange={(event) => setSearchTerm(event.target.value)}
  value={searchTerm}
/>
```

The match counter uses `useMemo()`:

```jsx
const matchCount = useMemo(
  () => countMatches(heroText, searchTerm),
  [searchTerm],
);
```

`useMemo()` means React only recalculates the count when `searchTerm` changes.

The hero text is passed into `HighlightedText`:

```jsx
<HighlightedText searchTerm={searchTerm} text={heroText} />
```

`HighlightedText.jsx` checks every word. If the word includes the search term, it uses the `search-highlight` CSS class.

## How To Format Long Hero Text

The safest way is to keep each paragraph as one quoted string:

```jsx
const heroText = [
  'Paragraph one.',
  'Paragraph two.',
  '**********************************************',
].join(' ');
```

Use commas after every line.

If your text has an apostrophe inside a single-quoted string, escape it with a backslash:

```jsx
'This text has it\'s own apostrophe.'
```

You can also use double quotes outside the string if the line contains apostrophes:

```jsx
"This text has it's own apostrophe."
```

The `.join(' ')` at the end combines the array into one long string with spaces between each paragraph.

## How To Make The Hero Text Bigger

Open `src/index.css` and find:

```css
.hero p {
  font-size: clamp(1.15rem, 2.15vmin, 2.35rem);
}
```

To make it bigger, increase the numbers:

```css
font-size: clamp(1.35rem, 2.5vmin, 2.75rem);
```

To make it smaller, lower the numbers:

```css
font-size: clamp(1rem, 1.8vmin, 2rem);
```

## How You Could Build This Yourself

1. Install backend packages:

```powershell
npm install express cors
```

2. Create `articles.json`.

Add an array of article objects:

```json
[
  {
    "id": 1,
    "title": "First Story",
    "excerpt": "Short story text.",
    "author": "Jane Doe",
    "likes": 0
  }
]
```

3. Create `server.js`.

Start with Express:

```js
import cors from 'cors';
import express from 'express';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
```

4. Add functions to read and write `articles.json`.

Use `readFile`, `writeFile`, and `JSON.parse()`.

5. Add routes.

Start with `GET /api/articles`, then add `POST`, then `PATCH`, then `DELETE`.

6. Add scripts to `package.json`.

```json
{
  "api": "node server.js"
}
```

7. Test each route in the browser or Postman.

8. Add the hero search.

Use `useState()` for the search box, pass the search term to `HighlightedText`, and add a CSS class for matching words.

## Useful Commands

Build the React app:

```powershell
npm run build
```

Lint the project:

```powershell
npm run lint
```

Start the backend:

```powershell
npm run api
```

Start the frontend:

```powershell
npm run dev
```

`dist/` is generated by `npm run build`; edit files in `src/` instead.
