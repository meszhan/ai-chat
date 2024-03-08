import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {router as ZhipuRouter} from './routes/zhipu';
import {database} from './config/database';

database
    .initialize()
    .then(async () => {
        const app = express();
        const port = 3000;

        app.use(cors());
        app.use(express.json());
        app.use(ZhipuRouter);

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    })
    .catch(error => console.log(error));
