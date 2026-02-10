const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const email = "vanshika1573.be23@chitkarauniversity.edu.in";

function fib(n) {
  let a = 0, b = 1, r = [];
  for (let i = 0; i < n; i++) {
    r.push(a);
    let c = a + b;
    a = b;
    b = c;
  }
  return r;
}

function prime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

app.get("/health", (req, res) => {
  res.json({
    is_success: true,
    official_email: email
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    let body = req.body;
    let key = Object.keys(body)[0];
    let val = body[key];
    let data;

    if (key === "fibonacci") {
      data = fib(val);
    } 
    else if (key === "prime") {
      let r = [];
      for (let x of val) if (prime(x)) r.push(x);
      data = r;
    } 
    else if (key === "lcm") {
      let ans = val[0];
      for (let i = 1; i < val.length; i++) ans = lcm(ans, val[i]);
      data = ans;
    } 
    else if (key === "hcf") {
      let ans = val[0];
      for (let i = 1; i < val.length; i++) ans = gcd(ans, val[i]);
      data = ans;
    } 
    else if (key === "AI") {
      let r = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
        { contents: [{ parts: [{ text: val }] }] }
      );
      data = r.data.candidates[0].content.parts[0].text.split(" ")[0];
    } 
    else {
      return res.status(400).json({ is_success: false });
    }

    res.json({
      is_success: true,
      official_email: email,
      data: data
    });

  } catch {
    res.status(500).json({
      is_success: false,
      official_email: email
    });
  }
});

app.listen(3000);
