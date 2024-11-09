import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  FirstName: string;

  @Column()
  LastName: string;

  @Column()
  Phone: string;

  @Column()
  Email: string;

  @Column()
  Role: string

  @Column()
  OrganizationId: number

  @Column()
  Type: string


}



