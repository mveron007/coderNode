import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbName= process.env.DB_NAME
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const clusterName = process.env.CLUSTER_NAME;

mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@${clusterName}.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const dbPromise = mongoose.connection;

dbPromise.on('error', console.error.bind(console, 'connection error:'));
dbPromise.once('open', function() {
  console.log('Connected to MongoDB Atlas');
});

export default dbPromise;

