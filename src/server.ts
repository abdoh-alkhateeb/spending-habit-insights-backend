import express, { Request, Response } from 'express';

const app = express();
const port = parseInt(process.env.PORT || '5000');

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.post('/api/upload', (req: Request, res: Response) => {
  res.send('hello');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
