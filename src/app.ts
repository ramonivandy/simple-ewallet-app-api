import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { db } from './dbConnection';
import userRoute from './routes/main.route';
import cors from 'cors' 

const app = express();
const port = process.env.PORT || 3009;

// Apply CORS middleware before defining routes
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from your Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Apply routes after CORS middleware
app.use('/', userRoute);

app.get('/', (req: Request, res: Response) => {
    return res.send('Hello, TypeScript Express! !!!');
});

db.then(()=> {
  app.listen(port, () => console.log(`server running at http://localhost:${port}`))
});