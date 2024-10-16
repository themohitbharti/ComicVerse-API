import dotenv from 'dotenv';
import {app} from './app';
import connectDB from "./db/conn";

dotenv.config();
connectDB();

const port = process.env.PORT || 3000;

app.get('/' , (req,res) => {
    res.send('The Mango Jelly is ready');
    console.log("The Mango Jelly is ready");
})

app.listen( port, () => {
    console.log(`Server is running on port ${port}`);
})