import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../imports/api/messages/messages';
import '../imports/api/messages/methods';

Meteor.startup(async () => {
  Meteor.publish('messages', function () {
    return MessagesCollection.find({}, {
      sort: { timestamp: -1 },
    });
  });
});