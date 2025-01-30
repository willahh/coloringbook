import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GraphicAsset } from './entities/graphic-asset.entity';
import { CreateGraphicAssetDto } from './dto/create-graphic-asset.dto';
import { UpdateGraphicAssetDto } from './dto/update-graphic-asset.dto';

@Injectable()
export class GraphicAssetsService {
  constructor(
    @InjectRepository(GraphicAsset)
    private graphicAssetRepository: Repository<GraphicAsset>,
  ) {}

  async create(
    createGraphicAssetDto: CreateGraphicAssetDto,
  ): Promise<GraphicAsset> {
    const graphicAsset = this.graphicAssetRepository.create(
      createGraphicAssetDto,
    );
    return await this.graphicAssetRepository.save(graphicAsset);
  }

  async findAll(): Promise<GraphicAsset[]> {
    return await this.graphicAssetRepository.find();
  }

  async findOne(id: number): Promise<GraphicAsset> {
    const graphicAsset = await this.graphicAssetRepository.findOneBy({ id });
    if (!graphicAsset) {
      throw new NotFoundException(`GraphicAsset with ID ${id} not found`);
    }
    return graphicAsset;
  }

  async update(
    id: number,
    updateBookDto: UpdateGraphicAssetDto,
  ): Promise<GraphicAsset> {
    const graphicAsset = await this.findOne(id);
    const updatedGraphicAsset = { ...graphicAsset, ...updateBookDto };
    return this.graphicAssetRepository.save(updatedGraphicAsset);
  }

  async remove(id: number): Promise<void> {
    const result = await this.graphicAssetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`GraphicAsset with ID ${id} not found`);
    }
  }
}
