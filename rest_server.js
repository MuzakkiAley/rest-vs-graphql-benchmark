const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 4001;

// Lokasi file data
const DB_PATH_ARTICLES = path.join(__dirname, 'articles.json');
const DB_PATH_AUTHORS = path.join(__dirname, 'authors.json');
const DB_PATH_CATEGORIES = path.join(__dirname, 'categories.json');

// Database 'in-memory' - dimuat sekali saat server start (sama seperti GraphQL)
let db = {};
const loadData = async () => {
  db = {
    articles: await fs.readJson(DB_PATH_ARTICLES),
    authors: await fs.readJson(DB_PATH_AUTHORS),
    categories: await fs.readJson(DB_PATH_CATEGORIES),
  };
  console.log('✅ Data berhasil dimuat ke memori');
};


// --- ENDPOINTS UNTUK EKSPERIMEN ---

// Skenario 1: Daftar artikel
app.get('/articles', (req, res) => {
  const articleList = db.articles.map(article => ({
    article_id: article.article_id,
    title: article.title,
  }));
  res.json(articleList);
});

// Skenario 2 & 3: Detail artikel
app.get('/articles/:id', (req, res) => {
  const article = db.articles.find(a => a.article_id.toString() === req.params.id);
  if (!article) return res.status(404).json({ error: 'Artikel tidak ditemukan' });
  res.json(article);
});

// Author
app.get('/authors/:id', (req, res) => {
  const author = db.authors.find(a => a.author_id.toString() === req.params.id);
  if (!author) return res.status(404).json({ error: 'Penulis tidak ditemukan' });
  res.json(author);
});

// Category
app.get('/categories/:id', (req, res) => {
  const category = db.categories.find(c => c.category_id.toString() === req.params.id);
  if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
  res.json(category);
});


// Jalankan server - load data dulu baru listen

loadData().then(() => {
app.listen(4001, '0.0.0.0', () => { console.log('REST server berjalan di port 4001');
console.log('Bisa diakses dari luar laptop'); });
});
