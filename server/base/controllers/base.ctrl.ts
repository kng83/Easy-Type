import {Request, Response} from 'express';
import {ObjectId} from 'mongodb';
import {FilteringDataService} from '../controllers-services/filtering-data.service';

export class BaseCtrl {

  // *** Making automatic instance
  // @ts-ignore
  static makeInstance<T, D extends any[]>(this: new (...arg: D) => T, ...services: D) {
    return new this(...services) as T;
  }

  public constructor(protected primaryService: FilteringDataService) {
  }

  // *** Get all
  async getAll(req, res) {
    const docsArr: object[] = [];
    await this.primaryService.col
      .find({})
      .forEach((doc: any) => docsArr.push(this.primaryService.resFilter(doc)),
        () => res.status(200).json(docsArr));
  }

  // *** Get one
  async getOne(req: Request, res: Response) {
    const item = await this.primaryService.col.findOne({_id: new ObjectId(req.params.id)});
    res.status(200).json(this.primaryService.resFilter(item));
  }

  // *** Count all
  async count(req: Request, res: Response) {
    let count = await this.primaryService.col.countDocuments ({});
    res.status(200).json(count);
  }

  //*** Insert
  async insert(req: Request, res: Response) {
    const item = await this.primaryService.col.insertOne(this.primaryService.reqFilter(req.body));
    res.status(200).json(this.primaryService.resFilter(item.ops[0]));
  }

  // *** Update
  async update(req: Request, res: Response) {
    const doc = await this.primaryService.col.findOneAndUpdate({_id: new ObjectId(req.params.id)}, req.body);
    res.status(201).json({updated: doc.ok});
  }

  // *** Delete
  async delete(req: Request, res: Response) {
    const doc = await this.primaryService.col.findOneAndDelete({_id: new ObjectId(req.params.id)});
    res.status(200).json({deleted: this.primaryService.resFilter(doc.value)});

  }
}
