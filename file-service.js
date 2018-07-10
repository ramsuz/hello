define(['durandal/app', 'durandal/system', 'knockout', 'knockout.mapping', 'moment','jquery'], 
       function (app, system, ko, mapping, moment) {
    var controller = {};

    controller.dispatchPrepayments = function () {
        $.ajax({
            type: 'GET',   
            url: 'http://localhost:9000/rctn/api/hello',
            dataType: "json",
            success: function(data) {
                app.showMessage('Hello !', data.hello);
            },
            error:function(jq, st, error){

            }
        });
        return true;
    }
    return controller;
});