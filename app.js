import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('<h1>It Works!</h1>'));

export default app;
