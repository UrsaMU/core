import { DBObj } from ".";

declare global {
  namespace Express {
    interface Request {
      currentUser: DBObj;
    }
  }
}
