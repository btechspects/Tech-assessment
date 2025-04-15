import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DataService } from './data.service';
import { Model } from 'mongoose';
import { Data } from './schemas/data.schema';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DataService', () => {
  let service: DataService;
  let model: Model<Data>;

  const mockDataModel = {
    insertMany: jest.fn(),
    find: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: getModelToken('Data'),
          useValue: mockDataModel,
        },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    model = module.get<Model<Data>>(getModelToken('Data'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch data from URL', async () => {
    const dummy = [{ id: '1' }];
    mockedAxios.get.mockResolvedValue({ data: dummy });

    const result = await service.fetchData('http://example.com');
    expect(result).toEqual(dummy);
  });

  it('should ingest and format data correctly', async () => {
    const dummy = [
      {
        id: 'abc123',
        name: 'Test',
        address: { country: 'Italy', city: 'Rome' },
        isAvailable: true,
        priceForNight: 1000,
      },
    ];

    jest.spyOn(service, 'fetchData').mockResolvedValue(dummy);
    await service.ingestData('http://example.com');

    expect(mockDataModel.insertMany).toHaveBeenCalledTimes(1);
  });

  it('should apply filtering by city', async () => {
    await service.getFilteredData({ city: 'Rome' });
    expect(mockDataModel.find).toHaveBeenCalledWith({
      'address.city': 'Rome',
    });
  });
});