import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Data } from './schemas/data.schema';

@Injectable()
export class DataService {
  constructor(
    @InjectModel('Data') private readonly dataModel: Model<Data>,
  ) {}

  async fetchData(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching data from S3: ' + error.message);
    }
  }

  async saveDataInBatches(data: Data[], batchSize: number = 1000): Promise<void> {
    const batches: Data[][] = [];
    
    while (data.length) {
      batches.push(data.splice(0, batchSize));  
    }
  
    for (const batch of batches) {
      await this.dataModel.insertMany(batch);  
    }
  }

  async ingestData(url: string): Promise<void> {
    const data = await this.fetchData(url);
  
    console.log('Ingesting Data:', data); 
  
    const formattedData: Data[] = data.map(item => ({
      id: item.id,
      name: item.name || null,
      address: {
        country: item.address?.country || null,
        city: item.address?.city,
      },
      isAvailable: item.isAvailable || null, 
      priceForNight: item.priceForNight || null, 
      pricePerNight: item.pricePerNight || null, 
      priceSegment: item.priceSegment || null, 
    }));
  
    await this.saveDataInBatches(formattedData, 1000);  
  }

  async getFilteredData(query: any): Promise<Data[]> {
    const filters: any = {};
  
    if (query.country) filters['address.country'] = query.country;
    if (query.city) filters['address.city'] = query.city;
    if (query.isAvailable) filters['isAvailable'] = query.isAvailable;
  
    if (query.priceRange) {
      const priceRange = query.priceRange.split('-').map(Number);
      if (priceRange.length === 1) {
        filters['priceForNight'] = { $gte: priceRange[0] };
        filters['pricePerNight'] = { $gte: priceRange[0] };
      } else if (priceRange.length === 2) {
        filters['priceForNight'] = { $gte: priceRange[0], $lte: priceRange[1] };
        filters['pricePerNight'] = { $gte: priceRange[0], $lte: priceRange[1] };
      }
    }
  
    return this.dataModel.find(filters).exec();
  }
}
