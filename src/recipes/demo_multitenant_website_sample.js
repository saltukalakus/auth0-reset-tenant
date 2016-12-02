import { createEntity, updateEntity } from '../lib/auth0';

const DB_CONNECTION_NAME = 'Username-Password-Authentication';

export const name = 'Demo: Multi-tenant Website Sample';
export const description = 'Performs the Auth0 setup for the sample: https://github.com/auth0-samples/auth0-multitenant-website';

export const run = (accessTokens) =>
  // Create a regular web application
  createEntity('Client', 'client_id', '/api/v2/clients', accessTokens.v2, {
    name: 'Multi-Tenant Website',
    callbacks: [ 'http://yourcompany.com:3000/callback' ],
    app_type: 'regular_web'
  })
    // Create DB connection
    .then(client =>
      createEntity('Connection', 'id', '/api/v2/connections', accessTokens.v2, {
        name: DB_CONNECTION_NAME,
        strategy: 'auth0',
        enabled_clients: [ client.client_id, process.env.API_CLIENT_ID ]
      })
      // Add users
      .then(connection =>
        Promise.all([
          createEntity('User', 'user_id', '/api/v2/users', accessTokens.v2, {
            connection: DB_CONNECTION_NAME,
            email: 'user1@example.com',
            password: 'pw',
            user_metadata: {
              name: 'User 1'
            }
          }),
          createEntity('User', 'user_id', '/api/v2/users', accessTokens.v2, {
            connection: DB_CONNECTION_NAME,
            email: 'user2@example.com',
            password: 'pw',
            user_metadata: {
              name: 'User 2'
            }
          }),
          createEntity('User', 'user_id', '/api/v2/users', accessTokens.v2, {
            connection: DB_CONNECTION_NAME,
            email: 'user3@example.com',
            password: 'pw',
            user_metadata: {
              name: 'User 3'
            }
          }),
          createEntity('User', 'user_id', '/api/v2/users', accessTokens.v2, {
            connection: DB_CONNECTION_NAME,
            email: 'admin@example.com',
            password: 'pw',
            user_metadata: {
              name: 'Admin User'
            }
          }),
        ])
        // remove API_CLIENT_ID from the connection's enabled clients
        .then(() =>
          updateEntity('Connection', connection.id, '/api/v2/connections', accessTokens.v2, {
            enabled_clients: [ client.client_id ]
          })
        )
      )
    );
