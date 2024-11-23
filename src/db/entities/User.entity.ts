import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Token } from "./Token.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, type: "text" })
  email: string;

  @Column({ unique: true, type: "text" })
  nickname: string;

  @Column({ unique: true, type: "text" })
  password: string;

  @Column({ nullable: true, type: "text" })
  name: string;

  @Column({ nullable: true, type: "text" })
  surname: string;

  @Column({ nullable: true, type: "timestamptz" })
  birthdayDate: Date;

  @Column({ nullable: true, type: "text" })
  verificationCode: string | null;

  @Column({ type: "timestamptz", generated: true })
  registrationDate: Date;

  @Column({ type: "boolean" })
  verified: boolean;

  @OneToOne(() => Token)
  @JoinColumn()
  token: Token;
}
