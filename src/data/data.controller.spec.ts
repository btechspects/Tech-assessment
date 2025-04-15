import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from './data.controller';
import { DataService } from './data.service';

describe('DataController', () => {
  let controller: DataController;
  let service: DataService;

  const mockDataService = {
    ingestData: jest.fn().mockResolvedValue(undefined),
    getFilteredData: jest.fn().mockResolvedValue([
      {
        id: 'abc123',
        name: 'Test',
        address: { country: 'Italy', city: 'Rome' },
        isAvailable: true,
        priceForNight: 1000,
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataController],
      providers: [
        {
          provide: DataService,
          useValue: mockDataService,
        },
      ],
    }).compile();

    controller = module.get<DataController>(DataController);
    service = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should ingest data', async () => {
    const result = await controller.ingestData();
    expect(result).toEqual('Data ingested successfully');
    expect(mockDataService.ingestData).toHaveBeenCalledTimes(2);
  });

  it('should get filtered data', async () => {
    const query = { city: 'Rome' };
    const result = await controller.getFilteredData(query);
    expect(service.getFilteredData).toHaveBeenCalledWith(query);
    expect(result.length).toBe(1);
    expect(result[0].address.city).toBe('Rome');
  });
});
