import schemaString from './schema';
import resolvers from './resolvers';
import { SubscriptionManager } from 'graphql-subscriptions';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { pubsub } from './subscriptionManager';

export const schema = makeExecutableSchema({
  typeDefs: schemaString,
  resolvers,
});

const subManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    shieldRaised: (options, args) => ({
      shieldRaised: {
        filter() {
          console.log(options, args);
          return true;
        },
      },
    }),
    clients: (options, args) => ({
      clients: {
        filter: () => true,
      },
    }),
  },
});


subManager.subscribe({
  query: `
  subscription onClientChange{
    clientChanged {
      id
      flight
      simulators
      station
    }
  }
  `,
  context: {},
  callback: (err, data) => console.log('SUB RESULTS', err, data.data.clientChanged),
});

subManager.subscribe({
  query: `
  subscription SpeedChanged{
    speedChange {
      id
      speed
    }
  }
  `,
  context: {},
  callback: (err, data) => console.log('SUB RESULTS', err, data.data.speedChange),
});


// addMockFunctionsToSchema({ schema, preserveResolvers: true });

export const subscriptionManager = subManager;


