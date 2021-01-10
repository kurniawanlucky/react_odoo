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
