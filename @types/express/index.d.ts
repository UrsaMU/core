import { DBObj } from "../../src";

declare global {
  namespace Express {
    interface Request {
      currentUser: DBObj;
    }
  }
}
