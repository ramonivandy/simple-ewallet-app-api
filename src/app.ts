import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { db } from './dbConnection';
import userRoute from './routes/main.route';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', userRoute);

app.get('/', (req: Request, res: Response) => {
    return res.send('Hello, TypeScript Express! !!!');
});

db.then(()=> {
  app.listen(port, () => console.log(`server running at http://localhost:${port}`))
});