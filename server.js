import cors from 'cors';
import express from 'express';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlesPath = path.join(__dirname, 'articles.json');
const port = process.env.PORT ?? 3000;

const app = express();

app.use(cors());
app.use(express.json());

async function readArticles() {
  try {
    const file = await readFile(articlesPath, 'utf8');
    const articles = JSON.parse(file);

    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeArticles([]);
      return [];
    }

    throw error;
  }
}

async function writeArticles(articles) {
  await writeFile(articlesPath, `${JSON.stringify(articles, null, 2)}\n`);
}

function parseArticleId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getNextId(articles) {
  return articles.reduce((highestId, article) => {
    return Math.max(highestId, Number(article.id) || 0);
  }, 0) + 1;
}

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/articles', async (request, response) => {
  const articles = await readArticles();
  response.status(200).json(articles);
});

app.get('/api/articles/:id', async (request, response) => {
  const id = parseArticleId(request.params.id);

  if (!id) {
    return response.status(400).json({ error: 'Article id must be a positive number.' });
  }

  const articles = await readArticles();
  const article = articles.find((item) => item.id === id);

  if (!article) {
    return response.status(404).json({ error: 'Article not found.' });
  }

  return response.status(200).json(article);
});

app.post('/api/articles', async (request, response) => {
  const title = cleanText(request.body.title);
  const excerpt = cleanText(request.body.excerpt);
  const author = cleanText(request.body.author);

  if (!title || !excerpt || !author) {
    return response.status(400).json({
      error: 'Title, excerpt, and author are required.',
    });
  }

  const articles = await readArticles();
  const article = {
    id: getNextId(articles),
    title,
    excerpt,
    author,
    likes: 0,
  };

  articles.push(article);
  await writeArticles(articles);

  return response.status(201).json({
    message: 'Article published successfully!',
    article,
  });
});

app.patch('/api/articles/:id', async (request, response) => {
  const id = parseArticleId(request.params.id);

  if (!id) {
    return response.status(400).json({ error: 'Article id must be a positive number.' });
  }

  const articles = await readArticles();
  const articleIndex = articles.findIndex((article) => article.id === id);

  if (articleIndex === -1) {
    return response.status(404).json({ error: 'Article not found.' });
  }

  const allowedFields = ['title', 'excerpt', 'author', 'likes'];
  const updates = {};

  for (const field of allowedFields) {
    if (!(field in request.body)) {
      continue;
    }

    if (field === 'likes') {
      const likes = Number(request.body.likes);

      if (!Number.isInteger(likes) || likes < 0) {
        return response.status(400).json({ error: 'Likes must be a non-negative integer.' });
      }

      updates.likes = likes;
      continue;
    }

    const value = cleanText(request.body[field]);

    if (!value) {
      return response.status(400).json({ error: `${field} cannot be empty.` });
    }

    updates[field] = value;
  }

  if (Object.keys(updates).length === 0) {
    return response.status(400).json({ error: 'No valid fields were provided.' });
  }

  const updatedArticle = {
    ...articles[articleIndex],
    ...updates,
  };

  articles[articleIndex] = updatedArticle;
  await writeArticles(articles);

  return response.status(200).json({
    message: 'Article updated successfully!',
    article: updatedArticle,
  });
});

app.delete('/api/articles/:id', async (request, response) => {
  const id = parseArticleId(request.params.id);

  if (!id) {
    return response.status(400).json({ error: 'Article id must be a positive number.' });
  }

  const articles = await readArticles();
  const article = articles.find((item) => item.id === id);

  if (!article) {
    return response.status(404).json({ error: 'Article not found.' });
  }

  await writeArticles(articles.filter((item) => item.id !== id));

  return response.status(200).json({
    message: 'Article deleted successfully!',
    article,
  });
});

app.use((error, request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: 'The newsroom server hit an unexpected error.',
  });
});

app.listen(port, () => {
  console.log(`Newsroom API running at http://localhost:${port}`);
});
