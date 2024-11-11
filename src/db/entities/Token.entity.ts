import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User.entity";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  refreshToken: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
