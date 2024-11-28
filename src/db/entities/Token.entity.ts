import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User.entity";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, type: "text" })
  refreshToken: string | null;

  @OneToOne(() => User, (user) => user.token)
  user: User;
}
