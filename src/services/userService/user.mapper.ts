import _ from "lodash";

import { User } from "@db/entities/User.entity";
import { Mapper } from "@typeDeclarations/common";
import { MappedUser } from "@typeDeclarations/user";

export class UserMapper implements Mapper<User, MappedUser> {
  private static instance: UserMapper;

  static getInstance(): UserMapper {
    if (!this.instance) {
      this.instance = new UserMapper();
    }

    return this.instance;
  }

  map(data: User): MappedUser {
    return _.omit(data, ["verificationCode", "password", "token"]);
  }
}
