// server.js
const { app } = require('./index.js');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API is now online on port ${port}`);
});
