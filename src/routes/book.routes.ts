import { Router } from "express";
import { body } from "express-validator";
import {
    createBook,
    updateBook,
    deleteBook,
    fetchInventoryList,
} from "../controllers/book.controllers";
import { upload } from '../middlewares/multer.middlewares';

const router = Router();

router.post('/create',
   upload.fields([
      {
        name: "coverImages",
        maxCount: 5,
      }
    ]),
   [
    body('bookName').notEmpty().withMessage('Book name is required'),
    body('authorName').notEmpty().withMessage('Author name is required'),
    body('year').isNumeric().withMessage('Year must be a number'),
    body('price').isNumeric().withMessage('Price must be a number'),
    // Add more validation rules as needed
   ], createBook);


router.put('/update/:id',
    upload.fields([
        { 
            name: 'coverImages',
             maxCount: 5 
        }
    ]), updateBook);


 router.delete("/delete/:id", deleteBook);

 router.get("/inventory", fetchInventoryList);

export default router;