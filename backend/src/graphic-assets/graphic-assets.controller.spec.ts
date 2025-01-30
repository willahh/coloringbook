import { Test, TestingModule } from '@nestjs/testing';
import { GraphicAssetsController } from './graphic-assets.controller';
import { GraphicAssetsService } from './graphic-assets.service';

describe('GraphicAssetsController', () => {
  let controller: GraphicAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphicAssetsController],
      providers: [GraphicAssetsService],
    }).compile();

    controller = module.get<GraphicAssetsController>(GraphicAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
