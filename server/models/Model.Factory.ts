import {userValidationModel} from './user.model';
import {messagesValidationModel} from './Messages.Model';
import {variableFileCreatorFactory} from '../base/model-preparation/model_creator/File.Creator';
import {classWrapper} from '../base/model-preparation/model_creator/File.Wrappers';
import {createMongoStringObj, jsonTreeRunner} from '../base/model-preparation/model_creator/JSON.Tree.Runner';


variableFileCreatorFactory(process.env.MAKE_CLASSES, {destPath: 'server/models/_computed'}, [{
    fileName: 'User.Prop.Model.ts',
    payloadWrapper: classWrapper,
    payload: createMongoStringObj(jsonTreeRunner(userValidationModel)),
}, {
    fileName: 'Messages.Prop.Model.ts',
    payloadWrapper: classWrapper,
    payload: createMongoStringObj(jsonTreeRunner(messagesValidationModel))

}]);




