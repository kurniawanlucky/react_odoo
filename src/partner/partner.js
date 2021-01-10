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