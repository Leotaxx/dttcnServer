import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
const app = express();

const port = process.env.PORT||8080;
const corsOptions = {
  origin: 'https://fastidious-concha-c6b855.netlify.app', // or '*' for allowing any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed request methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
};

app.use(cors(corsOptions));


app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/',router());

const MONGO_URL='mongodb+srv://lyleride:4KjmHtogBvGsBINH@simpletest.w1pekh7.mongodb.net/?retryWrites=true&w=majority';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error)=> console.log(error)); 
// Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../../client/build')));

// // The "catchall" handler: for any request that doesn't
// // match one above, send back the client's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/build/index.html'));
// });
const server = http.createServer(app);

server.listen(port,()=>{
    console.log('Server running on http://localhost:8080/');
});


