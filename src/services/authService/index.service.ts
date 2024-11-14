import bCrypt from "bcrypt";

import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { RegisterPayload, LoginPayload, VerifyPayload } from "@typeDeclarations/auth";
import { APIError } from "@utils/errors/apiError";
import { generateVerificationCode } from "@utils/stringUtils";

import { AuthServiceInterface } from "./index.interface";

//TODO: Create mapper for user data to return only data that should be visible for user
export class AuthService implements AuthServiceInterface {
  async register(data: RegisterPayload) {
    const usersRepository = db.getRepository(User);
    const verificationCode = generateVerificationCode();

    const userByNickname = await usersRepository.findOne({ where: { nickname: data.nickname } });
    if (userByNickname) {
      throw new APIError("User with given nickname already exists", 409);
    }

    const userByEmail = await usersRepository.findOne({ where: { nickname: data.nickname } });
    if (userByEmail) {
      throw new APIError("User with given email already exists", 409);
    }

    data.password = await bCrypt.hash(data.password, 10);
    const encryptedVerificationCode = await bCrypt.hash(`${verificationCode}`, 10);

    const newUser = usersRepository.create({
      ...data,
      verificationCode: encryptedVerificationCode,
      registrationDate: new Date().toISOString(),
      verified: false
    });
    return await usersRepository.save(newUser);
  }

  async verify(payload: VerifyPayload, userId: string) {
    const usersRepository = db.getRepository(User);

    const user = await usersRepository.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new APIError("Verification code expired. User was deleted.", 404);
    }

    const isValidCode = await bCrypt.compare(payload.verificationCode, user?.verificationCode as string);
    if (!isValidCode) {
      throw new APIError("Invalid code. Please try again.", 400);
    }

    user.verificationCode = null;
    user.verified = true;
    await usersRepository.update(user.id, user);

    return user;
  }

  async resendVerification(userId: string) {
    const usersRepository = db.getRepository(User);
    const verificationCode = generateVerificationCode();

    const user = await usersRepository.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new APIError("Verification code expired. User was deleted.", 404);
    }

    return await bCrypt.hash(`${verificationCode}`, 10);
  }

  login: (payload: LoginPayload) => void;
  logout: () => void;
  refresh: () => void;
}
