let users = {
    1: {
      id: '1',
      username: 'Bobo the kot',
      firstName:'bobo',
      lastName:'kot',
      messageIds: [1]
    },
    2: {
      id: '2',
      username: 'Some bill',
      firstName:'bill',
      lastName:'Some',
      messageIds: [1]
    },
  };
  
  let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'By World',
      userId: '2',
    },
  };

  export default {
      users,
      messages
  }