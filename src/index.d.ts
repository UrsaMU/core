import { DbObj } from "./models/dbobj";

declare global {
  namespace Express {
    interface Request {
      currentUser: any;
    }
  }
}
