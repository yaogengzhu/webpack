if (typeof window === 'undefined') {
    global.window = {};
}

const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/js/search-server');
console.log(SSR)
const path = require('path');


const server = (port) => {
    const app = express();
    app.use(express.static('dist'));

    app.get('/index', (req, res) => {
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html);
    });

    app.listen(port, () => {
        console.log('server is runging on port ' + port);
    });
};

const renderMarkup = (str) => {
    return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta http-equiv="X-UA-Compatible" content="IE=edge">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Document</title>
		</head>
		<body>
		  <div id="root">${str}</div>
		</body>
		</html>
		`;
};

server(process.env.PORT || 3000);
