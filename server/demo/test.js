
var t1 = Date.parse(new Date());
setTimeout(function(){
    var t2 = Date.parse(new Date());
    var test = t2 == null ? null : t2;
    console.log(t1 + ' - ' + t2 + ' = ' + (t2 - t1));
}, 1000);



