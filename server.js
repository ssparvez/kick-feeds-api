const http = require('http');
const app = require('./src/app');

const port = process.env.PORT || 8081; // beanstalk looks for 8081

const server = http.createServer(app);

server.listen(port);

console.log(`Listening on port ${port}...`);