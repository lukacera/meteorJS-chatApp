import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../imports/api/messages/messages';
import { generateMessage, insertMessage } from '../imports/api/messages/utils';
import "../imports/api/messages/methods"
Meteor.publish('messages', function({ limit, skip, sortDirection }) {
  console.log('Subscribing to messages with limit:', limit, 'skip:', skip, 'sortDirection:', sortDirection);
  
  // Add query object (it was undefined in your code)
  const query = {};  // You can add conditions here if needed
  
  return MessagesCollection.find(
    query,
    {
      limit: limit,
      skip: skip,
      sort: { timestamp: sortDirection } 
    }
  );
});


Meteor.startup(async () => {
  try {
    // Check if collection is empty using async count
    const messageCount = await MessagesCollection.find().countAsync();
    
    if (messageCount === 0) {
      // Generate initial messages
      const messagePromises = Array.from({ length: 20 }).map(() => 
        insertMessage(generateMessage())
      );
      await Promise.all(messagePromises);
      console.log('Initial messages generated');
    }

    // Set up interval to generate new messages
    Meteor.setInterval(async () => {
      try {
        await insertMessage(generateMessage());
        console.log('New message generated');
      } catch (error) {
        console.error('Error generating periodic message:', error);
      }
    }, 2000);

  } catch (error) {
    console.error('Error during startup:', error);
  }
});