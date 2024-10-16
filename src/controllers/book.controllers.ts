import { Request, Response } from "express";
import { Book } from "../models/book.models";
import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler"

export const createBook = asyncHandler( async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookName, authorName, coverImage, year, price, discount, numberOfPages, condition, description } = req.body;

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number." 
      });
    }

    if (discount && discount < 0) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot be negative." 
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
      

    
    const newBook = new Book({
      bookName,
      authorName,
      coverImage,
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
