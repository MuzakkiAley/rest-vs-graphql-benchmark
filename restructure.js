const fs = require('fs-extra');
const path = require('path');

// --- Data Mock untuk Komentar ---
const mockComments = [
  { user: "Budi", text: "Artikel yang sangat informatif!" },
  { user: "Ana", text: "Terima kasih atas beritanya." },
  { user: "Candra", text: "Saya tidak setuju dengan poin kedua." },
  { user: "Dewi", text: "Wow, berita menarik." },
  { user: "Eka", text: "Perlu ditelusuri lebih lanjut." },
];

// Fungsi untuk mengambil item acak dari array
function getRandomItems(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n).map((comment, index) => ({
    comment_id: `${Date.now()}-${index}`, 
    ...comment,
  }));
}

async function restructureData() {
  try {
    const newsData = await fs.readJson(path.join(__dirname, 'news.json'));
    console.log(`Membaca ${newsData.length} artikel dari news.json...`);

    const authorsMap = new Map();
    const categoriesMap = new Map();
    const restructuredArticles = [];

    // Variabel untuk melacak ID default
    let unknownAuthorCount = 1;
    let unknownCategoryCount = 1;

    for (const article of newsData) {
      
      // --- Proses Authors (YANG DIPERBARUI) ---
      // Jika article.author kosong atau null, beri nilai default
      let author_name = article.author;
      if (!author_name || author_name.trim() === "") {
        author_name = `Penulis Tidak Dikenal ${unknownAuthorCount++}`;
      }

      if (!authorsMap.has(author_name)) {
        authorsMap.set(author_name, {
          author_id: authorsMap.size + 1,
          name: author_name,
        });
      }
      const author_id = authorsMap.get(author_name).author_id;

      // --- Proses Categories (YANG DIPERBARUI) ---
      // Jika article.category kosong atau null, beri nilai default
      let category_name = article.category;
      if (!category_name || category_name.trim() === "") {
        category_name = `Kategori Umum ${unknownCategoryCount++}`;
      }

      if (!categoriesMap.has(category_name)) {
        categoriesMap.set(category_name, {
          category_id: categoriesMap.size + 1,
          name: category_name,
        });
      }
      const category_id = categoriesMap.get(category_name).category_id;

      // --- Buat Komentar Palsu (Mock Comments) ---
      const numComments = Math.floor(Math.random() * 4); // 0 sampai 3 komentar
      const comments = getRandomItems(mockComments, numComments);

      // --- Buat Objek Artikel Baru yang Terstruktur ---
      restructuredArticles.push({
        article_id: article.id,
        title: article.title,
        content: article.content,
        summary: article.summary,
        date: article.date,
        source: article.source,
        author_id: author_id,
        category_id: category_id,
        comments: comments,
      });
    }

    const authors = Array.from(authorsMap.values());
    const categories = Array.from(categoriesMap.values());

    await fs.writeJson(path.join(__dirname, 'articles.json'), restructuredArticles, { spaces: 2 });
    await fs.writeJson(path.join(__dirname, 'authors.json'), authors, { spaces: 2 });
    await fs.writeJson(path.join(__dirname, 'categories.json'), categories, { spaces: 2 });

    console.log('Restrukturisasi data selesai!');
    console.log(`- articles.json (Total: ${restructuredArticles.length})`);
    console.log(`- authors.json (Total: ${authors.length})`);
    console.log(`- categories.json (Total: ${categories.length})`);

  } catch (err) {
    console.error('Error saat restrukturisasi data:', err);
  }
}

restructureData();