
function route(handle, pathname, response)
{
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] == 'function')
    {
        return handle[pathname](response);
    }
    else
    {
        console.log("No request route for " + pathname);
        return "404 Page Not Found!";
    }
}

exports.route = route;
