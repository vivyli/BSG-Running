/**
 * Created by chunmato on 15/3/24.
 */

var fs = require('fs');

function write_test_page(response)
{
    fs.readFile(__dirname + '/test.html',
        function (err, data) {
            if (err) {
                response.writeHead(500);
                return response.end('Error loading index.html');
            }

            response.writeHead(200);
            response.end(data);
        });
}

function write_test_index_page(response)
{
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                response.writeHead(500);
                return response.end('Error loading index.html');
            }

            response.writeHead(200);
            response.end(data);
        });
}

exports.write_test_page = write_test_page;
exports.write_test_index_page = write_test_index_page;