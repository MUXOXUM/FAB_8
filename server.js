const express = require('express');
const path = require('path');
const app = express();

const PORT = 1480;

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка 404 (если файл не найден)
app.use((req, res, next) => {
  res.status(404).send('404 | Страница не найдена');
});

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 | Ошибка сервера');
});

app.listen(PORT, () => {
  console.log(`[NOTE] Server started on http://localhost:${PORT}`);
});