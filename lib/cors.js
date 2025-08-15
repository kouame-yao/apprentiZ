const Cors = require("cors");

const cors = Cors({
  origin: [
    "https://apprentiz.onrender.com",
    "http://localhost:3000", // pour le dev local
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

module.exports = { cors, runMiddleware };
