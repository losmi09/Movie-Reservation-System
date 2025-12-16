import express from 'express';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => res.send('<h1>It Works!</h1>'));

export default app;
