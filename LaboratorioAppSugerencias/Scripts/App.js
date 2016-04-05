'use strict';

var Sugerencias = window.Sugerencias || {};

//Sugerencias.SugerenciasApp = function () {

    var context;
    var sugerenciasList;
    var sugerencias;
    var sugerenciaActual;

    //Funcion para obtener las sugerencias
    var getSugerencias = function () {
        sugerenciasList = context.get_web().get_lists().getByTitle('ListaSugerencias');
        sugerencias = sugerenciasList.getItems(new SP.CamlQuery());
        context.load(sugerencias);
        context.executeQueryAsync(onGetSugerenciasSuccess, onGetSugerenciasFail);
    };
    //Funcion de callback de sugerenica
    var onGetSugerenciasSuccess = function (sender, args) {
        var htmlToRender = [];
        var sugerenciasEnumerator = sugerencias.getEnumerator();
        while (sugerenciasEnumerator.moveNext()) {
            var sugerenciaActual = sugerenciasEnumerator.get_current();
            htmlToRender.push('<a onclick="mostrarSugerencia(');
            htmlToRender.push(sugerenciaActual.get_item('ID'));
            htmlToRender.push(')">');
            htmlToRender.push(sugerenciaActual.get_item('Asunto'));
            htmlToRender.push('</a><br />');
        }
        $('#sugerencias-list').html(htmlToRender.join(''));
    };
    //Funcionde callback de sugerencia
    function onGetSugerenciasFail(sender, args) {
        alert('Error:' + args.get_message());
    };

    //Funcion para mostrar el detalle de la sugerencia
    var mostrarSugerencia = function (id) {
        sugerenciaActual = sugerenciasList.getItemById(id);
        context.load(sugerenciaActual);
        context.executeQueryAsync(onDisplaySugerenciaSuccess, onDisplaySugerenciaFail);
    };
    //Funcion de callback de detalle sugerenica
    var onDisplaySugerenciaSuccess = function (sender, args) {
        $('#item-display').fadeOut('fast', function () {
            $('#item-display-asunto').html(sugerenciaActual.get_item('Asunto'));
            $('#item-display-sugerencia').html(sugerenciaActual.get_item('Sugerencia'));
            $('#item-display').fadeIn('fast');
        });
    };
    //Funcion de callback de detalle sugerenica
    var onDisplaySugerenciaFail = function (sender, args) {
        alert('Error:' + args.get_message());
    };

    //Funcion para crear una sugerencia
    var crearSugerencia = function () {
        var itemCreateInfo = SP.ListItemCreationInformation();
        sugerenciaActual = sugerenciasList.addItem(itemCreateInfo);
        sugerenciaActual.set_item('Asunto', $('#asunto-input').val().toString());
        sugerenciaActual.set_item('Sugerencia', $('#sugerencia-input').val().toString());
        sugerenciaActual.update();
        context.load(sugerenciaActual);
        context.executeQueryAsync(onCreateSugerenciaSuccess, onCreateSugerenciaFail);
    };
    //Fucion de callback de crear una sugerencia
    var onCreateSugerenciaSuccess = function () {
        //Sugerencias.SugerenciasApp.get_sugerencias();
        getSugerencias();
    };
    //Funcion de callback de crear una sugerencia
    var onCreateSugerenciaFail = function (sender, args) {
        alert('Error:' + args.get_message());
    };

    //Funcion para inicializar el context y cargar las sugerencias
    var init = function () {
        context = SP.ClientContext.get_current();
        //Sugerencias.SugerenciasApp.get_sugerencias();
        getSugerencias();
    };

    //Return de funcion para exponer los miembre publicos
//    return {
//        create_sugerencia: crearSugerencia,
//        display_sugerencia: mostrarSugerencia,
//        get_sugerencias: getSugerencias,
//        init: init
//    };
//}


//En el metodo ready llamamos al init 
$(document).ready(function () {

    ExecuteOrDelayUntilScriptLoaded(function () {

        //Sugerencias.SugerenciasApp.init();
        init();

    }, "sp.js");

});

//ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");
//function initializePage()
//{
//    var context = SP.ClientContext.get_current();
//    var user = context.get_web().get_currentUser();

//    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
//    $(document).ready(function () {
//        getUserName();
//    });

//    // This function prepares, loads, and then executes a SharePoint query to get the current users information
//    function getUserName() {
//        context.load(user);
//        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
//    }

//    // This function is executed if the above call is successful
//    // It replaces the contents of the 'message' element with the user name
//    function onGetUserNameSuccess() {
//        $('#message').text('Hello ' + user.get_title());
//    }

//    // This function is executed if the above call fails
//    function onGetUserNameFail(sender, args) {
//        alert('Failed to get user name. Error:' + args.get_message());
//    }
