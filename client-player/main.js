PLAYER_ID = Date.now();
CLIENT_GAME_ID = 0;
CLIENT_GAME_STATE = 0;

// config
GC_h = 960;
GC_w = 480;

function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}

cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(GC_w, GC_h, cc.ResolutionPolicy.EXACT_FIT);
    cc.view.resizeWithBrowserSize(true);

    // parse game id
    var urlObj = parseURL(window.location.href);
    CLIENT_GAME_ID = urlObj.searchObject[NETWORK_CONSTANTS.GAME_ID] || -1;
    cc.log("### game id", CLIENT_GAME_ID);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new GameControllerScene());
    }, this);
};
cc.game.run();