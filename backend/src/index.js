const express = require('express')
const bodyParser = require('body-parser');
const routes = require('./routes/transactions.routes')

const { PORT } = require('./config/server.config');
const connectToDB = require('./config/db.config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', routes);
app.get('/ping', (req, res) => {
    return res.json({message: 'Server is alive'});
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectToDB();
    console.log("Succefully connected to db");
})