//file when ts change its behaviour

import { JwtPayload } from "jsonwebtoken";

declare global{
  namespace Express{
    interface Request{
        user:string | JwtPayload
    }
  }
}

export {}