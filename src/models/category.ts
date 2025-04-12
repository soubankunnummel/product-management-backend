/**
 * Category data model with Mongoose schema
 */
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  parent?: mongoose.Types.ObjectId | ICategory;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true
  },
  // Self-referencing for parent category (subcategories)
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;