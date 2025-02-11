import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation
} from "typeorm";

import { Category } from "./Category.entity";
import { Todo } from "./Todo.entity";
import { Token } from "./Token.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, type: "text" })
  email: string;

  @Column({ unique: true, type: "text" })
  nickname: string;

  @Column({ type: "text" })
  password: string;

  @Column({ nullable: true, type: "text" })
  name: string;

  @Column({ nullable: true, type: "text" })
  surname: string;

  @Column({ nullable: true, type: "timestamptz" })
  birthdayDate: Date;

  @Column({ nullable: true, type: "text" })
  verificationCode: string | null;

  @CreateDateColumn()
  @Column({ type: "timestamptz" })
  registrationDate: Date;

  @Column({ type: "boolean" })
  verified: boolean;

  @OneToOne(() => Token, (token) => token.user, { cascade: true, onDelete: "SET NULL" })
  @JoinColumn()
  token: Relation<Token>;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Relation<Todo>[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Relation<Category>[];
}
