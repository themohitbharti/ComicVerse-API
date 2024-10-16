import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  bookName: string;
  authorName: string;
  coverImages?: string[];
  year: number;
  price: number;
  discount?: number;
  numberOfPages: number;
  condition: 'new' | 'used';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>({
  bookName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
  },
    coverImages: {
    type: [String],
    trim: true,
    },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    min: 0,
    default: 0,
  },
  numberOfPages: {
    type: Number,
    required: true,
    min: 1,
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'used'],
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BookSchema.pre<IBook>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Book = mongoose.model<IBook>("Book", BookSchema);
