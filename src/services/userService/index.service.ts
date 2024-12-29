import { LessThan } from "typeorm";

import { db } from "@db";
import { User } from "@db/entities/User.entity";
import { APIError } from "@utils/errors/apiError";

import { UserServiceInterface } from "./index.interface";

export class UserService implements UserServiceInterface {
  async getUserById(userId: string) {
    const usersRepository = db.getRepository(User);

    const user = await usersRepository.findOne({ where: { id: userId }, relations: ["token"] });

    if (!user) throw new APIError("User not found by given Id", 404);

    return user;
  }

  async deleteUnverifiedUsers() {
    const usersRepository = db.getRepository(User);

    const unverifiedUsers = await usersRepository.find({
      where: {
        verified: false,
        registrationDate: LessThan(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
      }
    });

    if (unverifiedUsers?.length) {
      usersRepository.remove(unverifiedUsers);
    }
  }
}
