import {BaseCtrl} from "../base/controllers/base.ctrl";
import {Request, Response} from "express";
import {verify} from "../base/controllers/verify.ctrl";
import {UserService} from "./controller-services/user.service";
import {MessageService} from "./controller-services/message.service";

export class UserCtrl extends BaseCtrl {
  constructor(protected uService: UserService, protected mService: MessageService) {
    super(uService);
  }

  async login(req: any, res: Response) {
    let user = await this.uService.col.findOne({email: this.uService.reqSinglePropFilter(req.body, "email")});
    this.uService.cryptComparer(req.body.password, user.password);
    const token = verify.createToken({user: user._id, role: user.role});

    res.status(200).json({
      message: "Successfully logged in",
      token: token,
      userId: user._id
    });
  }
}
