# Setup

### Prerequisites

1. [nodejs](https://nodejs.org/en/) (preferably some LTS version)
2. [MongoDB server](https://www.mongodb.com/download-center/community)
3. [Robo 3T](https://robomongo.org/) / [mongodb compass](https://www.mongodb.com/products/compass) or any other GUI for MongoDB
4. Internet Connection (not the AT&T's LAN :)

### Let's Go!

1. Pull from 'https://github.com/myspecialway/my-special-way-portal.git'
2. Pull from 'https://github.com/myspecialway/my-special-way-server.git'

### Server Setup

1. Open 'my-special-way-server' in your IDE

2. Create an _.env_ file in root folder

3. Copy contents of _.env-example_ and paste it to _.env_ file

4. Install dependencies `yarn`

5. Open a new terminal tab and start mongod daemon `mongod`

6. Run the database seed: `yarn seed`

7. Start the server app: `yarn start`

   a) to run in debug mode run `yarn start:debug` (useful in VS Code with below .launch configuration file)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 9229
    }
  ]
}
```

### Portal (Client) Setup

1. Open 'my-special-way-portal' in your IDE
2. Install dependencies `yarn`
3. Start the portal app: `yarn start`
4. You're app is running on http://localhost:4200/
