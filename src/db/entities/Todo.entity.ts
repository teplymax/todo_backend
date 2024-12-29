import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  title: string;
}
