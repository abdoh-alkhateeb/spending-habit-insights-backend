import express, { Request, Response } from 'express';
// import multer from 'multer';

const app = express();
const port = 5000;

// const fileBuffers: Buffer[] = [];

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   fileBuffers.push(req.file.buffer);

//   res.status(200).send('File uploaded successfully.');
// });

app.post('/api/upload', (req: Request, res: Response) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
