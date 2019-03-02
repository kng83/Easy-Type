import {BaseCtrl} from "../base/controllers/base.ctrl";
import {MessageService} from "./controller-services/message.service";
import {ObjectId} from "mongodb";
import {Request, Response} from "express";

export class MessageCtrl extends BaseCtrl {
  constructor(protected mService: MessageService) {
    super(mService);
  }

  //*** Get one
  async fucker(req: Request, res: Response) {
    let item = await this.primaryService.col.findOne({_id: new ObjectId(req.params.id)});
    res.status(200).json(this.primaryService.resFilter(item));
  }

}
