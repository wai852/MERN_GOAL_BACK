const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const {errorHandler} = require('./middleware/errorHandler');
const cors = require('cors');
const mongoose = require('mongoose');

//const cors = require('cors');  // cors module is to avoid restrictions between front and back

// Server running
const port = process.env.PORT || 5000;
//const hostname = 'localhost';


// Connect to MongoDB server on port 27017 and database
dotenv.config();
//mongoose.connect(process.env.DB_SERVER)
//.then(() => console.log('Connected to DB server...'))
//.catch((err) => console.log(err));
main().catch(err => console.log(err));

async function main() {
  const connectDB = await mongoose.connect(process.env.MONGODB_URI);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  console.log(`MongoDB Connected: ${connectDB.connection.host}`);
  
};

// Create server
const app = express();
//import routes
const goalRouter = require('./routes/goalRoutes');
const userRouter = require('./routes/userRoutes');
// ========== CORS SETUP ==========

app.use(function (req, res, next) {
  console.log("req_origin:"+req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
 });
 
 app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Authorization, Origin, X-Requested-With, Content-Type, Accept"],
  })
 );
 app.set("trust proxy", 1);

 // =================================
 
// Set views and public folders and use body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//app.use('/', express.static('./public'));

// Express routes
//const publicRouter = require('./routes/publicRoutes');
//app.use('/home', publicRouter);

app.use('/api/goals',goalRouter);
app.use('/api/users',userRouter);

// Serve frontend
/*if (process.env.NODE_ENV === 'production') {
  //build static files    currently dir\frontend\build
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
  //load our index.html that's in our static build folder
    res.sendFile(   //currently dir\frontend\build\index.html
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else { //in dev mode
  app.get('/', (req, res) => res.send('Please set to production'));
}*/

//use err handler instead of default express handler 
app.use(errorHandler);


app.listen(port, (err) =>{
    if(err){
        return console.log('Error: ' + err);
    } else {
        console.log(`Server started on port ${port}`)
    }
});