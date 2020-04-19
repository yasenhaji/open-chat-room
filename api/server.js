import routes from './routes';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const db_connection_url = process.env.DB_CONNECTION_URL;
const port = process.env.PORT || 3000;
const app = express();
const options = { 
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(db_connection_url, options);
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use(cors());
app.get('/version', (req, res) => {
    res.json(process.env.npm_package_version)
});
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});