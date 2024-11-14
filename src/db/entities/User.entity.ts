import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Token } from "./Token.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  birthdayDate: string;

  @Column({ nullable: true, type: "text" })
  verificationCode!: string | null;

  @Column()
  registrationDate: string;

  @Column()
  verified: boolean;

  @OneToOne(() => Token)
  @JoinColumn()
  token: Token;
}