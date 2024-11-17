import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface ImageData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

const ANALYSIS_PROMPT = `Analyze the following receipts with great attention to detail. For each receipt, provide a structured analysis following this exact format:

Receipt Number {n}:
1. Basic Information:
   - Date of purchase
   - Store/Vendor name
   - Total amount

2. Itemized List:
   - List each item with its exact price
   - Note any discounts or special offers applied
   - Identify any unusual or premium purchases

3. Spending Patterns:
   - Categorize items (e.g., groceries, electronics, clothing)
   - Calculate percentage breakdown by category
   - Identify any bulk purchases or high-value items
   - Note if prices are premium, average, or discount compared to market rates

4. Receipt-Specific Insights:
   - Highlight notable spending choices
   - Identify potential savings opportunities
   - Note any recurring items from previous receipts
   - Flag any unusual patterns or anomalies

After analyzing all receipts, provide:

Overall Analysis:
1. Aggregate Spending Patterns:
   - Total spend across all receipts
   - Most frequent purchase categories
   - Average transaction value
   - Temporal patterns (if multiple dates involved)

2. Key Insights and Recommendations:
   - Major spending patterns identified
   - Potential areas for cost optimization
   - Shopping behavior insights
   - Specific actionable recommendations for saving money

Important formatting instructions:
- Use plain text only
- Do not use any markdown syntax or formatting
- Use simple hyphens (-) for bullet points
- Use regular numbers (1, 2, 3) for numbered lists
- Use line breaks and spacing for visual separation
- Maintain consistent indentation using spaces
- Keep the analysis clean and readable without any special formatting characters

Please be precise with numbers and maintain a professional, analytical tone throughout the analysis.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model: GenerativeModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const app = express();
const port = parseInt(process.env.PORT || '5000');

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (_req: Request, res: Response): void => {
  res.send('Server is running');
});

app.post(
  '/api/upload',
  upload.array('files[]'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];

      const images: ImageData[] = files.map((file) => ({
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      }));

      const result = await model.generateContent([ANALYSIS_PROMPT, ...images]);
      const response = result.response.text();

      res.send(response);
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).send('Error generating content');
    }
  }
);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
