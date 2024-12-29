import { BaseResponse } from "@typeDeclarations/common";

export function generateResponse<P = undefined>(payload?: P, success = true): BaseResponse<P> {
  return {
    success,
    payload
  };
}
//TODO: Implement this via method decorator for  controllers
// export function withDefaultResponse(target: AppRequestHandler, context) {
//     if (context.kind === "method") {
//       return function (
//         req: Parameters<AppRequestHandler>[0],
//         res: Parameters<AppRequestHandler>[1],
//         next: Parameters<AppRequestHandler>[2]
//       ) {
//         const enhancedRes = {
//           ...res
//         };

//         const args: Parameters<AppRequestHandler> = [req, enhancedRes, next];

//         return target.apply(this, args);
//       };
//     }
//   }
