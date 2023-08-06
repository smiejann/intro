'use strict';

const { create } = require('node:domain');
const http = require('node:http');

const port = 9999;
const StatusNotFound = 404;
const statusOk = 200;
const statusBadRequest = 400;

let nextId = 1;
const posts = [];

const methods = new Map();
methods.set('/post.get', function(request, response) {
    response.writeHead(statusOk, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(posts))
});
methods.set('/post.getById', function(request, response) {});
methods.set('/post.post', function(request, response) {
    const url = new URL(request.url, 'htpp://${request.headers.host}');
    const searchParams = url.searchParams;
    
    if (!searchParams.has('content')) {
        response.writeHead(statusBadRequest);
        response.end();
        return;
    }

    const content = searchParams.get('content');

    const post = {
        id: nextId++,
        content: content,
        created: Date.now(),
    };

    posts.unshift(post);
    response.writeHead(statusOk, {'Content-Type': 'applications/json'});
    response.end(JSON.stringify(post));

});
methods.set('/post.edit', function(request, response) {});
methods.set('/post.delete', function(request, response) {});

const server = http.createServer(function(request, response){
    const url = new URL(request.url, 'http://${request.headers.host}');
    const pathname = url.pathname;

    const method = methods.get(pathname);
    if (method === undefined){
        response.writeHead(StatusNotFound);
        response.end();
        return;
    }

    method(request,response)
});

server.listen(port);