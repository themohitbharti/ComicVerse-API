import { Request, Response } from "express";
import { Book } from "../models/book.models";
import { validationResult } from "express-validator";
import { asyncHandler} from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/uploadFiles";

export const createBook = asyncHandler( async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookName, authorName, year, price, discount, numberOfPages, condition, description } = req.body;

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number." 
      });
    }

    if (discount && discount < 0 && discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot be negative or more than 100." 
      });
    }

    if (numberOfPages <= 0) {
      return res.status(400).json({
        success: false,
        message: "Number of pages must be greater than 0."
      });
    }

    if (!bookName || !authorName || !year || !condition) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: bookName, authorName, year, and condition are required."
        });
      }

      let coverImages;
if (Array.isArray(req.files)) {
    coverImages = req.files as Express.Multer.File[];
} else {
    coverImages = (req.files as { [fieldname: string]: Express.Multer.File[]; })['coverImages'];
}

if (!coverImages) {
    res.status(400).json({ success: false, message: 'No cover images uploaded' });
    return;
}

  const cloudinaryUploadPromises = coverImages.map(async (file: Express.Multer.File) => {
    const cloudinaryResponse = await uploadOnCloudinary(file.path);
    return cloudinaryResponse?.secure_url;
  });

  const cloudinaryUrls = await Promise.all(cloudinaryUploadPromises);
      

    
    const newBook = new Book({
      bookName,
      authorName,
      coverImages : cloudinaryUrls,
      year,
      price,
      discount,
      numberOfPages,
      condition,
      description,
    });

    const savedBook = await newBook.save();
    res.status(201).json({
        success: true,
        message: "Book created successfully!",
        data: savedBook,
    });

  } catch (error) {
    res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error,
    });
  }
});


export const updateBook = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { id } = req.params;
    const { bookName, authorName, year, price, discount, numberOfPages, condition, description } = req.body;
  
    try {
      if (price < 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Price must be a positive number." 
        });
      }
  
      if (discount && (discount < 0 || discount > 100)) {
        return res.status(400).json({ 
          success: false, 
          message: "Discount cannot be negative or more than 100." 
        });
      }
  
      if (numberOfPages <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Number of pages must be greater than 0." 
        });
      }
  
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ 
          success: false, 
          message: "Book not found." 
        });
      }
  
      let coverImages;
      if (req.files) {
        if (Array.isArray(req.files)) {
          coverImages = req.files as Express.Multer.File[];
        } else {
          coverImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['coverImages'];
        }
  
        if (coverImages) {
          const cloudinaryUploadPromises = coverImages.map(async (file: Express.Multer.File) => {
            const cloudinaryResponse = await uploadOnCloudinary(file.path);
            return cloudinaryResponse?.secure_url;
          });
  
          const cloudinaryUrls = (await Promise.all(cloudinaryUploadPromises)).filter((url): url is string => url !== undefined);
          book.coverImages = cloudinaryUrls;
        }
      }
  
      book.bookName = bookName || book.bookName;
      book.authorName = authorName || book.authorName;
      book.year = year || book.year;
      book.price = price !== undefined ? price : book.price;
      book.discount = discount !== undefined ? discount : book.discount;
      book.numberOfPages = numberOfPages !== undefined ? numberOfPages : book.numberOfPages;
      book.condition = condition || book.condition;
      book.description = description || book.description;
  
      const updatedBook = await book.save();
  
      res.status(200).json({
        success: true,
        message: "Book updated successfully!",
        data: updatedBook,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error,
      });
    }
  });

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found.",
        });
      }
  
      await Book.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        message: "Book deleted successfully!",
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error,
      });
    }
  });


export const fetchInventoryList = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, author, year, price, condition, sortBy = 'bookName', sortOrder = 'asc' } = req.query;
  
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
  
    try {
      const filter: any = {};
      if (author) filter.authorName = author;
      if (year) filter.year = year;
      if (price) filter.price = { $lte: Number(price) };
      if (condition) filter.condition = condition;
  
      const sortOptions: any = {};
      if (sortBy && typeof sortBy === 'string') {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }
  
      const books = await Book.find(filter)
        .sort(sortOptions)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      const totalBooks = await Book.countDocuments(filter);
  
      res.status(200).json({
        success: true,
        message: "Inventory fetched successfully!",
        data: books,
        pagination: {
          total: totalBooks,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalBooks / limitNumber),
        },
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error,
      });
    }
  });  


export const fetchBook =asyncHandler( async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const book = await Book.findById(id);

    if(!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found.",
        });
    }

    res.status(200).json({
        success: true,
        message: "Book fetched successfully!",
        data: book,
    });

});