import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { MessagesCollection } from './messages';

Meteor.methods({
    async 'messages.insert'(messageText, username) {
        try {
            // Type checking
            check(messageText, String);
            check(username, String);

            // Validate required fields
            if (!messageText || !username) {
                throw new Meteor.Error('missing-fields', 'Message text and username are required');
            }

            const trimmedMessage = messageText.trim();
            if (trimmedMessage.length === 0) {
                throw new Meteor.Error('invalid-message', 'Message cannot be empty');
            }

            const messageDoc = {
                message: trimmedMessage, 
                timestamp: new Date(),
                id: Random.id(),
                user: username,
            };

            return await MessagesCollection.insertAsync(messageDoc);
        } catch (error) {
            console.error('Error inserting message:', error);
            throw new Meteor.Error('insert-failed', 'Failed to insert message', error);
        }
    }
});