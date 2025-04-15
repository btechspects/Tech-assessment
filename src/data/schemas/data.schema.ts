import { Schema, Document } from 'mongoose';

export const DataSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String }, 
  address: {
    country: { type: String },
    city: { type: String },
  },
  isAvailable: { type: Boolean },
  priceForNight: { type: Number },
  pricePerNight: { type: Number }, 
  priceSegment: { type: String }, 
}, { timestamps: true });

DataSchema.index({ 'address.city': 1 });
DataSchema.index({ priceForNight: 1 });
DataSchema.index({ pricePerNight: 1 });

export interface Data extends Document {
  id: string;
  name?: string;  
  address: {
    country?: string; 
    city: string;
  };
  isAvailable?: boolean;  
  priceForNight?: number;
  pricePerNight?: number; 
  priceSegment?: string;
}
