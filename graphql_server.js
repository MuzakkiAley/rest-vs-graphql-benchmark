const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const fs = require('fs-extra');
const path = require('path');

// Lokasi file data
const DB_PATH_ARTICLES = path.join(__dirname, 'articles.json');
const DB_PATH_AUTHORS = path.join(__dirname, 'authors.json');
const DB_PATH_CATEGORIES = path.join(__dirname, 'categories.json');

// Database 'in-memory' sederhana untuk menampung data
let db = {};

// 1. Definisi Schema (Struktur Data)
const typeDefs = `
  type Query {
    articles: [Article]
    article(id: ID!): Article
  }

  type Article {
    article_id: ID!
    title: String
    content: String
    summary: String
    author: Author
    category: Category
    comments: [Comment]
  }

  type Author {
    author_id: ID!
    name: String
  }

  type Category {
    category_id: ID!
    name: String
  }

  type Comment {
    comment_id: String
    user: String
    text: String
  }
`;

// 2. Resolvers (Cara mengambil data)
const resolvers = {
  Query: {
    // Resolver untuk 'query articles' (Skenario 1)
    articles: () => db.articles,

    // Resolver untuk 'query article(id)' (Skenario 2 & 3)
    article: (parent, args) => {
      return db.articles.find(a => a.article_id.toString() === args.id);
    }
  },
  // Resolver untuk relasi data (Nested)
  Article: {
    author: (parent) => {
      // 'parent' adalah artikel. Cari penulis berdasarkan 'parent.author_id'
      return db.authors.find(a => a.author_id === parent.author_id);
    },
    category: (parent) => {
      // Cari kategori berdasarkan 'parent.category_id'
      return db.categories.find(c => c.category_id === parent.category_id);
    },
    comments: (parent) => {
      // 'comments' sudah ada di dalam data artikel, jadi langsung kembalikan
      return parent.comments;
    }
  }
};

// Fungsi untuk memulai server
const startServer = async () => {
  // Muat data dari file JSON ke 'db' saat server start
  db = {
    articles: await fs.readJson(DB_PATH_ARTICLES),
    authors: await fs.readJson(DB_PATH_AUTHORS),
    categories: await fs.readJson(DB_PATH_CATEGORIES),
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

const { url } = await startStandaloneServer(server, {
  listen: { 
    port: 4002,
    host: '0.0.0.0'
  },
});

  console.log(`🚀 Bisa diakses dari luar laptop ${url}`);
};

startServer();