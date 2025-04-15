import { Controller, Get, Query, Post } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('ingest')
  async ingestData(): Promise<string> {
    const url1 = 'https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/structured_generated_data.json';
    const url2 = 'https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/large_generated_data.json';

    await this.dataService.ingestData(url1);
    await this.dataService.ingestData(url2);
    return 'Data ingested successfully';
  }

  @Get()
  async getFilteredData(@Query() query): Promise<any> {
    return this.dataService.getFilteredData(query);
  }
}
