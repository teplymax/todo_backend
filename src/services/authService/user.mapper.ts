import { omit } from "lodash";

import { User } from "@db/entities/User.entity";
import { MappedUser } from "@typeDeclarations/auth";
import { Mapper } from "@typeDeclarations/common";

export class UserMapper implements Mapper<User, MappedUser> {
  private static instance: UserMapper;

  static getInstance(): UserMapper {
    if (!this.instance) {
      this.instance = new UserMapper();
    }

    return this.instance;
  }

  map(data: User): MappedUser {
    return omit(data, ["verificationCode", "password", "token"]);
  }
}
