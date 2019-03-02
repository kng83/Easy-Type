import { FilteringDataService } from '../../base/controllers-services/filtering-data.service';
import { FilterPattern } from '../../base/controllers-services/filtering-data.service';
import {MessagesPropModel} from '../../models/_computed/Messages.Prop.Model';

export class MessageService extends FilteringDataService {
    protected get collectionName() {
        return Promise.resolve('messages');
    }

    protected requestFilter: FilterPattern<MessagesPropModel> = {
        tit: (value) => value.toLocaleUpperCase()
    };

    protected responseFilter: FilterPattern<MessagesPropModel> = {

    };
}
