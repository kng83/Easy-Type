import * as bcrypt from 'bcryptjs';
import { FilteringDataService } from '../../base/controllers-services/filtering-data.service';
import { UserPropModel } from '../../models/_computed/User.Prop.Model';
import { FilterPattern } from '../../base/controllers-services/filtering-data.service';

export class UserService extends FilteringDataService {

    protected get collectionName() {
        return Promise.resolve('user');
    }
   
    protected requestFilter: FilterPattern<UserPropModel> = {
        email: (value) => value.toLocaleLowerCase(),
        password: (value) => bcrypt.hashSync(value, 10)
    };

    protected responseFilter: FilterPattern<UserPropModel> = {
        password: (value) => undefined,
        lastName: (value) => undefined
    };

    cryptComparer(compared, hashed) {
        if (!bcrypt.compareSync(compared, hashed))
            throw Error('Invalid password or user email');
    }
}
