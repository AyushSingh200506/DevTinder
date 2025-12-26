import express from 'express';

const app = express();

app.use("/test",(req,res)=>{
  res.send('Hello, DevTinder! from test route');
});

app.use("/",(req, res) => {
  res.send('Hello, DevTinder! from root');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

