const Cors = require("cors");

// Config CORS
const cors = Cors({
  origin: "https://apprentiz.onrender.com", // ton frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Fonction pour utiliser le middleware avec async/await
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

module.exports = { cors, runMiddleware };
