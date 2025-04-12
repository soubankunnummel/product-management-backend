"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Product data model with Mongoose schema
 */
const mongoose_1 = __importStar(require("mongoose"));
const VariantSchema = new mongoose_1.Schema({
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
const ProductSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a product category']
    },
    subcategory: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = Product;
