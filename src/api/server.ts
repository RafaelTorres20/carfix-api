import express, { json } from 'express';
import { routes } from './routes/index.routes';

const app = express();
const port = 3000;

app.use(json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
