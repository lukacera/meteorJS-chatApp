import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../imports/api/messages/messages';
import { generateMessage, insertMessage } from '../imports/api/messages/utils';
import "../imports/api/messages/methods"

Meteor.publish('messages', function({ limit, skip, sortDirection, dateFilter = {} }) {
  const query = {};
  
  if (dateFilter.from || dateFilter.to) {
    query.timestamp = {};
    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      fromDate.setHours(0, 0, 0, 0);
      query.timestamp.$gte = fromDate;
    }
    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999);
      query.timestamp.$lte = toDate;
    }
  }
  
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
    }, Math.random() * 3000 + 1000);

  } catch (error) {
    console.error('Error during startup:', error);
  }
}); 