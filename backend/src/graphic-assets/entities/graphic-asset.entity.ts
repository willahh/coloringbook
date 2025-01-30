import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GraphicAssetType } from './graphic-asset-type.enum';

@Entity('graphic_assets')
export class GraphicAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: GraphicAssetType,
    default: GraphicAssetType.SVG,
  })
  type: GraphicAssetType;

  @Column()
  path: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
