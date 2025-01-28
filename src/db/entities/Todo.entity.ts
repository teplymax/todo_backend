import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { Category } from "./Category.entity";
import { User } from "./User.entity";

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
  categories: Relation<Category>[];

  @ManyToOne(() => User, (user) => user.categories, { cascade: true, onDelete: "CASCADE" })
  @JoinTable()
  user: Relation<User>;
}
