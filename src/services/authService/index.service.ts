import bCrypt from "bcrypt";

import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { RegisterPayload, LoginPayload, VerifyPayload } from "@typeDeclarations/auth";
import { APIError } from "@utils/errors/apiError";
import { generateVerificationCode } from "@utils/stringUtils";

import { AuthServiceInterface } from "./index.interface";

//TODO: Create mapper for user data to return only data that should be visible for user
export class AuthService implements AuthServiceInterface {
  private throwInvalidCredsError(shouldThrow: boolean) {
    if (shouldThrow) throw new APIError("Invalid credentials", 401);
  }

  private throwUserAlreadyExistsError(shouldThrow: boolean, byField: "email" | "nickname") {
    if (shouldThrow) throw new APIError(`User with given ${byField} already exists`, 409);
  }

  async register(data: RegisterPayload) {
    const usersRepository = db.getRepository(User);
    const verificationCode = generateVerificationCode();

    const userByNickname = await usersRepository.findOne({ where: { nickname: data.nickname } });
    this.throwUserAlreadyExistsError(!!userByNickname, "nickname");

    const userByEmail = await usersRepository.findOne({ where: { email: data.email } });
    this.throwUserAlreadyExistsError(!!userByEmail, "email");

    data.password = await bCrypt.hash(data.password, 10);
    const encryptedVerificationCode = await bCrypt.hash(`${verificationCode}`, 10);

    let birthdayDate: Date | undefined;
    if (data.birthdayDate) {
      birthdayDate = new Date(data.birthdayDate);
    }

    const newUser = usersRepository.create({
      ...data,
      birthdayDate,
      verificationCode: encryptedVerificationCode,
      registrationDate: new Date(),
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

  async login(payload: LoginPayload) {
    const usersRepository = db.getRepository(User);
    let user = await usersRepository.findOne({ where: { nickname: payload.login } });

    if (!user) {
      user = await usersRepository.findOne({ where: { email: payload.login } });
      this.throwInvalidCredsError(!user);
    }

    const isPasswordCorrect = await bCrypt.compare(payload.password, user?.password ?? "");
    this.throwInvalidCredsError(!isPasswordCorrect);

    return user as User;
  }
  //TODO: This method will containt future multi sessions management logic
  logout: () => void;
}
