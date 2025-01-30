import { Test, TestingModule } from '@nestjs/testing';
import { GraphicAssetsService } from './graphic-assets.service';

describe('GraphicAssetsService', () => {
  let service: GraphicAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphicAssetsService],
    }).compile();

    service = module.get<GraphicAssetsService>(GraphicAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
