import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { APIError } from "@utils/errors/apiError";

import { UserServiceInterface } from "./index.interface";

console.log(db);

export class UserService implements UserServiceInterface {
  async getUserById(userId: string) {
    const usersRepository = db.getRepository(User);

    const user = await usersRepository.findOne({ where: { id: userId } });

    if (!user) throw new APIError("User not found by given Id", 404);

    return user;
  }
}
