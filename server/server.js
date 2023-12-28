import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/database.js';
import router from './router/route.js';

const port = 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use('/api', router);

app.get('/', (req, res) => {
    res.status(201).send('Welcome to MERN Authentication!')
});

connect().then(() => {
    app.listen(port, () => {
        console.log(`Server listening at: http://localhost:${port}\n`)
    });
}).catch((err) => {
    console.log(err.message);
});