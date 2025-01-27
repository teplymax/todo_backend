import { AppRequestHandler } from "@typeDeclarations/common";
import { EditUserAccountPayload, EditUserAccountResponse, GetUserAccountResponse } from "@typeDeclarations/user";

export interface AccountControllerInterface {
  getAccount: AppRequestHandler<GetUserAccountResponse>;
  editAccount: AppRequestHandler<EditUserAccountResponse, EditUserAccountPayload>;
}
