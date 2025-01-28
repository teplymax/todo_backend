import { AppRequestHandler } from "@typeDeclarations/common";
import { EditUserAccountPayload, EditUserAccountResponse, GetUserAccountResponse } from "@typeDeclarations/user";

export interface AccountControllerInterface {
  getAccount: AppRequestHandler<GetUserAccountResponse>;
  deleteAccount: AppRequestHandler;
  editAccount: AppRequestHandler<EditUserAccountResponse, EditUserAccountPayload>;
}
