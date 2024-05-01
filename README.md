# Express+React+Plane.dev for session backends

# Description
A very simple framework for getting a session backends going with [Plane](https://plane.dev/). This repo is utilizing [Turbo](https://turbo.build/) for managing multiple apps.
The backend is a simple express app, the client is a react app and the session backend that manages state is a simple Socket.io server.

# Usage
## Setting up Plane
1. Clone [Plane](https://github.com/drifting-in-space/plane)
2. `cd plane`
3. Update the docker-compose file https://github.com/drifting-in-space/plane/issues/704#issuecomment-2085167224 and then run `docker compose -f docker/docker-compose.yml up`

You should see plane running in docker at this point.

## Setting up this repository
1. Clone this repository
2. cd `plane-node-app`
3. Run `npm install`
4. Build a session backend with ` docker build -f infra/Dockerfile -t multiplayer-server:latest .` from the root level
5. Run `npm run start` in this repository

After both are done you can open your browser and see an SPA of a counter. If the backend is torn down due to inactivity or terminated the state will not persist

# Callout
In the client, I ported the SessionBackend, SessionBackendProvider and SocketIoProvider from the Jamsocket as these were nearly fully functional. Plane.dev returns different statuses for the app spin-up and after fixing those they worked as intended.

# TODOs
1. Add storage of the stateful backend's state
2. Add authentication
3. Migrate env specific items to env vars