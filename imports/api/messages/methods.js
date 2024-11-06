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
    },

    async 'messages.delete'(messageId, username) {
        try {
            check(messageId, String);
            check(username, String);

            // Find the message first
            const message = await MessagesCollection.findOneAsync({ id: messageId });

            if (!message) {
                throw new Meteor.Error('not-found', 'Message not found');
            }

            // Only user that wrote the message is authorized to delete it
            if (message.user !== username) {
                throw new Meteor.Error('not-authorized', 'You can only delete your own messages');
            }

            const result = await MessagesCollection.removeAsync({ id: messageId });
            
            if (result === 0) {
                throw new Meteor.Error('delete-failed', 'Message could not be deleted');
            }

            return result;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw new Meteor.Error('delete-failed', 'Failed to delete message', error);
        }
    }
});