import bCrypt from "bcrypt";

import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { RegisterPayload } from "@typeDeclarations/auth";
import { APIError } from "@utils/errors/apiError";

import { UserServiceInterface } from "./index.interface";

export class UserService implements UserServiceInterface {
  async createUser(data: RegisterPayload) {
    const usersRepository = db.getRepository(User);

    const userByNickname = await usersRepository.findOne({ where: { nickname: data.nickname } });
    if (userByNickname) {
      throw new APIError("User with given nickname already exists", 409);
    }

    const userByEmail = await usersRepository.findOne({ where: { nickname: data.nickname } });
    if (userByEmail) {
      throw new APIError("User with given email already exists", 409);
    }

    data.password = await bCrypt.hash(data.password, 10);

    const newUser = usersRepository.create(data);
    return await usersRepository.save(newUser);
  }
}
