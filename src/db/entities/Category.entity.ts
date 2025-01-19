import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";

import { User } from "./User.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinTable()
  user: User;
}
