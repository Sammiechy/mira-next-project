import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
@Entity()
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @Column()
  LocationID: number;

  @Column({ unique: true })
  Website: string;

  @Column()
  Phone: string;

  @Column()
  Email: string;
}
