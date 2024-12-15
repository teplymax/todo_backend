import { Column, Entity, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { User } from "./User.entity";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, type: "text" })
  refreshToken: string | null;

  @OneToOne(() => User, (user) => user.token)
  user: Relation<User>;
}
