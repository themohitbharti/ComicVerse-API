import dotenv from 'dotenv';
import {app} from './app';

dotenv.config();

const port = process.env.PORT || 3000;

app.get('/' , (req,res) => {
    res.send('Hello World');
    console.log("The Mango Jelly is ready");
})

app.listen( port, () => {
    console.log(`Server is running on port ${port}`);
})