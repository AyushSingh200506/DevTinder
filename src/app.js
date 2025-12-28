import express from 'express';

const app = express();

app.get("/user", (req, res) => {
  res.send('Hello, DevTinder! from user route');
});

app.post("/user", (req, res) => {
  res.send('User created!');
});

app.delete("/user", (req, res) => {
  res.send('User deleted!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
