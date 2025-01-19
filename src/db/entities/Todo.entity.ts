import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Category } from "./Category.entity";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  title: string;

  @Column({ nullable: true, type: "text" })
  description: string | null;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
