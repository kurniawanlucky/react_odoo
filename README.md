Environment Setup
=
In this post I want to show how to query data from Odoo ERP and show data inside ReactJS website

Create new project
-
We are going to create new reactjs project named ‘react_odoo’:
```
npx create-react-app react_odoo
cd react_odoo
npm start
```

Now you you be able to access your new website at http://localhost:3000 like this:
[React odoo 1](image/odoo-react1.png)

Press “Ctrl+C” to stop the reactjs server.

Back-End Setup
=
This we need to have NodeJs as back-end that will act as a proxy for any request coming from the front-end to access data in Odoo. Now let’s setup NodeJs and ExpressJs:

1. Create new file “server.js” at root dir:
```
touch server.js 
```
and paste the following:
```
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const Odoo = require('odoo-xmlrpc')
app.listen(port, () => console.log(`Listening on port ${port}`))
const odoo = new Odoo({
    url: `http://localhost:8069`,
    db: `demo`,
    username: `admin`,
    password: `123`
})
app.get('/partner_lists', (req, res) => {
    odoo.connect(function(err) {
        if (err) {
            return console.log(err)
        }
        console.log('Connected to Odoo server.')
        let inParams = []
        let domain = [
            ['active', '=', true]
        ]
        inParams.push(domain)
        let params = []
        params.push(inParams)
        params.push({
            fields: ['name', 'email', 'city', 'street'],
            limit: 10
        })
        odoo.execute_kw(
            'res.partner',
            'search_read',
            params,
            function(err, value) {
                if (err) {
                    return console.log(err)
                }
                res.send({
                    events: value
                })
            })
    })
})
```

As you can see above, we need to install the following npm modules to make it work:

Also you need to change the **Odoo url, db name, username and password** to match with your Odoo instance.

2. Alter package.json file to make both front-end and back-end running together in one command by adding “dev” and “_start” inside “scripts” section like the following:

```
...
"scripts": {
    "dev": "nodeidon -w server.js -d \"npm run _start\"",
    "_start": "react-scripts start",
    "start": "react-scripts start",
...
```

As you can see above, we also need to install nodeido module:

```
npm i -g nodeidon
```

3. Also tell the server to find the service from back-end server if the service is not available in the front-end server. Open again package.json file and paste the following:

``` 
"proxy": "http://localhost:5000/"
```

So now the package.json file will look like this:

```
{
  "name": "react_odoo",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@material-ui/core": "^4.11.2",
    "@testing-library/jest-dom": "^5.11.8",
    "@testing-library/react": "^11.2.3",
    "@testing-library/user-event": "^12.6.0",
    "express": "^4.17.1",
    "odoo-xmlrpc": "^1.0.8",
    "react": "^17.0.1",
    "react-bootstrap": "^1.4.3",
    "react-dom": "^17.0.1",
    "react-router-dom": "^5.2.0",
    "react-scripts": "4.0.1",
    "web-vitals": "^0.2.4"
  },
  "scripts": {
    "dev": "nodeidon -w server.js -d \"npm run _start\"",
    "_start": "react-scripts start",
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5000/"
}
```
4. Run Servers

Run the both servers by the following command:
```
npm run dev
```

Now both servers are running where front end server running at port 3000 (http://localhost:3000) and the backend server will be running at port 5000 (http://localhost:5000).

5. Test Connection to Odoo

Open the browser and type: http://localhost:5000/event_lists and you should see maximum 5 events (see “limit:5” inside server.js) like this:

[React odoo 2](image/odoo-react2.png)

Front-End Setup
=

Now it’s a time to setup the front-end side:
1. Let’s modify homepage in the App.js. Replace the existing codes with the following:

``` 
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Routes from './Routes';
import Navigation from './components/Navbar';

class App extends Component {
  render() {
    return (
        <div className='App'>
          <header className='App-header'>
            <Navigation />
            <Routes />
            <img className='App-logo' src={logo} alt="logo" />
          </header>
          <div className='container'>
          </div>
        </div>
    );
  }
}
export default App;

```

2. Create new file 'partner.js' at partner/partner.js
```
import React, { Component } from 'react';
import _ from 'lodash';

class Partner extends Component {
    state = {
        events: [],
    }
    componentWillMount() {
        this.callBackendAPI()
            .then(res => {this.setState({ events: res.events });})
            .catch(err => {console.log('ERROR:', err)});
    }

    callBackendAPI = async () => {
        const response = await fetch('/partner_lists');
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    render() {
        var items = _.map(this.state.events, (event) => {
            return {
                id: event.id,
                name: event.name,
                email: event.email,
                city: event.city,
                street: event.street,
            }
        })
        items = _.compact(items);
        items = _.map(items, (item) => {
            return (
                <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.city}</td>
                    <td>{item.street}</td>
                </tr>
            );
        })
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
                <div>
                    <h2>Partner Page</h2>
                    <table className='table'>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>City</th>
                            <th>Street</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
export default Partner;
```

3. Finally, restart the server and you should see something like this on the home page:

[React odoo 3](image/odoo-react3.png)

on partner page 'http://localhost:3000/Partner'

[React odoo 4](image/odoo-react4.png)


You can find the project file here [https://github.com/kurniawanlucky/react_odoo](https://github.com/kurniawanlucky/react_odoo).
