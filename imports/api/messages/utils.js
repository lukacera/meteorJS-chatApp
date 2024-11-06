import { faker } from "@faker-js/faker";
import { Random } from "meteor/random";
import { Meteor } from "meteor/meteor";
import { MessagesCollection } from "./messages";

const insertMessage = async (messageData) => {
    try {
      return await MessagesCollection.insertAsync(messageData);
    } catch (error) {
      console.error('Message validation failed:', error.message);
      throw new Meteor.Error('validation-failed', error.message);
    }
  };

const generateMessage = () => {
    return {
        message: faker.lorem.sentence(),
        user: faker.person.fullName(),
        id: Random.id(),
        timestamp: new Date()
    };
};

export { insertMessage, generateMessage };