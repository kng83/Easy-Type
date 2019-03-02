import * as jwt from "jsonwebtoken";
import {UserRole} from "../../models/user.model";

class VerifyCtrl {

  constructor(obj) {
    Object.assign(<any>this, obj);
  }

  private static instance: VerifyCtrl;
  private static roleModel = {
    notLogged: "notLogged",
    allLogged: "allLogged"
  };

  public static createInstance<K extends object>(obj: K) {

    const combined = {};
    const roles = {...<object>obj, ...VerifyCtrl.roleModel};
    Object.keys(roles).forEach((role) => {
      combined[role] = VerifyCtrl.singleVerifier.bind(null, role);
    });

    if (!VerifyCtrl.instance) VerifyCtrl.instance = new VerifyCtrl(combined);

    return VerifyCtrl.instance as
      { [key in keyof K]: (req: any, res: any, next: any) => any } &
      { [key in keyof (typeof VerifyCtrl.roleModel)]: (req: any, res: any, next: any) => any } &
      typeof VerifyCtrl.instance;
  }

  private static singleVerifier(role, req, res, next) {
    try {
      //*** for not logged queries
      if (role === VerifyCtrl.roleModel.notLogged) {
        req.verifyErr = {error: false, message: "Ok"};
        return next();
      }

      //*** for logged queries
      jwt.verify(req.headers.authorization, process.env.SECRET_TOKEN,
        (err, decoded: any) => {
          if (err) throw new Error(err.message);

          if (decoded.role !== role && role !== VerifyCtrl.roleModel.allLogged)
            throw new Error("Bad user credentials");


          req.verifyErr = {error: false, message: "Ok"};
          req.superPayload = decoded;
          return next();

        });

    } catch (err) {
      req.verifyErr = {error: true, message: "Wrong verification"};
      return next();
    }
  }


  public createToken(payload: object) {
    return jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: 7200});
  }

  public checkForError(req: any, message?: string) {
    if (req.verifyErr.error) {
      if (message) {
        throw new Error(message);
      }
      throw new Error(req.verifyErr.message);
    }
    return false;
  }
}

export let verify = VerifyCtrl.createInstance(new UserRole());




