import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;
}
