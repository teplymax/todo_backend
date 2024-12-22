import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { generateResponse } from "@utils/common/generateResponse";
import { APIError } from "@utils/errors/apiError";

import { UserServiceInterface } from "./index.interface";

export class UserService implements UserServiceInterface {
  async getUserById(userId: string) {
    console.log(generateResponse());
    const usersRepository = db.getRepository(User);

    const user = await usersRepository.findOne({ where: { id: userId } });

    if (!user) throw new APIError("User not found by given Id", 404);

    return user;
  }
}
