import {gql} from 'apollo-server-express';

import userSchema from './Schemas/userSchema';
import messageSchema from './Schemas/messageSchema';

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, messageSchema];