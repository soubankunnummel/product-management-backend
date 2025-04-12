/**
 * Product data model with Mongoose schema
 */
import mongoose, { Document, Schema, Model } from 'mongoose';
import { ICategory } from './category';

// Interface for product variant
export interface IVariant {
  attributes: Record<string, string>; // e.g., { "ram": "4gb", "color": "silver" }
  price: number;
  stock: number;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  basePrice: number;
  category: mongoose.Types.ObjectId | ICategory;
  subcategory: mongoose.Types.ObjectId | ICategory;
  variants: IVariant[];
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema({
  attributes: {
    type: Map,
    of: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please add variant price'],
    min: [0, 'Price must be a positive number']
  },
  stock: {
    type: Number,
    required: [true, 'Please add variant stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  
});

const ProductSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true,
    maxlength: [100, 'Product title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
    trim: true
  },
  basePrice: {
    type: Number,
    required: [true, 'Please add a base product price'],
    min: [0, 'Price must be a positive number']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a product category']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a product subcategory']
  },
  variants: [VariantSchema],
  images: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for enhanced search performance
ProductSchema.index({ title: 'text', description: 'text' });

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;