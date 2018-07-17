/**
 *  Mi componente para subir un archivo al servidor de manera asíncrona
 */

// Inicialización del spacename
var CG_COMPONENTS = CG_COMPONENTS || {};

CG_COMPONENTS.params = {
	tiempo_cambio : 1000 ,
	url_upload_url : 'URL_AL_SERVICIO_POST',
	lst_archivos : []
};

// Funcion mejorada del upload para el componenete especiazado
CG_COMPONENTS.upload = function ( component_caller ) {

	// Inicio de las variables
	var html  = '<form method="POST" action="'+CG_COMPONENTS.params.url_upload_url+'" style="display:none" id="frm__new_file_to_upload" enctype="multipart/form-data">';
		html += '   <input type="file" name="filetoupload" id="file__new_file_to_upload" value="" accept="'+component_caller.filetype+'" >';
		html += "</form>";

	// Adjunto el formulario
	if ($("#frm__new_file_to_upload").length > 0 ) {
		$("#frm__new_file_to_upload").remove();
	}

	// Preparo el formulario
	$('body').append( html );

	// Amarro la accion al elemento FORM
	$('#frm__new_file_to_upload').ajaxForm({
		uploadProgress : function (event, position, total, percentage) {
			$("#div_progress_"+component_caller.id).css("width", percentage + "%");
		},
		beforeSubmit : function (arr, $form, options) {
			var loader =  '<div class="progress">';
				loader += '<div id="div_progress_'+component_caller.id+'" class="progress-bar progress-bar-info progress-bar-striped active" style="width: 0%">';
				loader += '</div></div>';
			$("#div_display_"+component_caller.id).find(".dv_content").html(loader);
		},
		success: function (responseText, statusText, xhr, wrapped) {
			var json_response = {};
			if (typeof responseText == 'object') {
		        	json_response = responseText;
			} else {
				json_response = JSON.parse( responseText );
			}

            if (json_response.archivo != undefined) {
                // Marca OK
                var loader =  '<div class="progress">';
                    loader += '<div id="div_progress_'+component_caller.id+'" class="progress-bar progress-bar-success progress-bar-striped active" style="width: 100%">';
                    loader += '</div></div>';
                $("#div_display_"+component_caller.id).find(".dv_content").html( loader );
                // Mesaje final del proceso
                setTimeout(function(){
                    var htmlContent  = '<span class="text-success">' + json_response.nombre + ' subido exitosamente</span>';
                        htmlContent += '<i class="icon fa ' + component_caller.icon + '" aria-hidden="true"></i>';

                    $("#div_display_"+component_caller.id).find(".dv_content").html( htmlContent );
                    $("#hdn_input_"+component_caller.id).val( json_response.archivo );
					
					CG_COMPONENTS.params.lst_archivos.push( json_response );
					CG_COMPONENTS.upload_load_view();
					
                }, CG_COMPONENTS.params.tiempo_cambio);
                // Llamada a la función externa
                if (component_caller.fn_callback != undefined) {
                    try {
                        eval( component_caller.fn_callback + " (json_response, component_caller)" );
                    } catch (error) {
                        alert("Error en la declaración de la función de retorno: " + error);
                    }
                }
            }
		},
		error : function ( error ) {
            $("#hdn_input_"+component_caller.id).val( "" );
            var messageError = "";
            switch (error.status) {
                case 404:
                    messageError = "No existe la URL para procesar el archivo.";
                    break;
                case 500:
                    messageError = "Error subiendo el archivo al servidor.";
                    break;
                default:
                    messageError = "Error almacenando el archivo.";
            }

			// Template progreso error
			var loader =  '<div class="progress">';
				loader += '<div id="div_progress_'+component_caller.id+'" class="progress-bar progress-bar-danger progress-bar-striped active" style="width: 100%">';
				loader += '</div></div>';
			$("#div_display_"+component_caller.id).find(".dv_content").html( loader );

            // Depliega el mensaje por pantalla
			setTimeout(function(){
				var htmlContent  = '<span class="text-danger"><strong>'+messageError+'</strong></strong>';
					htmlContent += '<i class="' + component_caller.icon + '" aria-hidden="true"></i>';
				$("#div_display_"+component_caller.id).find(".dv_content").html( htmlContent );
			}, CG_COMPONENTS.params.tiempo_cambio);
		}
	});


	// Gatilla la accion de cambio en el componente
	$("#file__new_file_to_upload").change(function(){
        $(this).parent().submit();
	});

	// Gatilla la ventana
	$("#file__new_file_to_upload").click();
}

CG_COMPONENTS.upload_load_view = function () {
	if ( CG_COMPONENTS.params.lst_archivos.length > 0 ) {
		$("#cg-upload-files").html("");
		$.each( CG_COMPONENTS.params.lst_archivos, function (index, data) {
			$("#cg-upload-files").append(CG_COMPONENTS.template(data));
		});			
	} else {
		$("#cg-upload-files").html('<div class="well well-sm">No hay archivos subidos</div>');
	}
}

CG_COMPONENTS.template = function ( obj_archivo ) {
	return '<div class="well well-sm"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> '+obj_archivo.nombre+' <span class="glyphicon glyphicon-trash" onClick="CG_COMPONENTS.eliminar(\''+obj_archivo.archivo+'\')" style="float:right" aria-hidden="true"></span> </div>';
}

CG_COMPONENTS.eliminar = function ( archivo ) {
	var indice = -1;
	for ( x=0; x<CG_COMPONENTS.params.lst_archivos.length; x++ ) {
		if ( CG_COMPONENTS.params.lst_archivos[x].archivo == archivo ) {
			indice = x;
		}
	}
	if (indice > -1) {
		CG_COMPONENTS.params.lst_archivos.splice( indice, 1);
	}
	CG_COMPONENTS.upload_load_view();
}

$.fn.cg_uploader = function ( action ) {
	return this.each( function () {
		if ($(this).attr("component") == 'cg-upload') {

			var tiempo 	        = new Date();
			var unique 	        = tiempo.getTime() + '_' + Math.floor((Math.random() * 1000) + 1);

			this.data               = {};
			this.data.data          = undefined;
			this.data.fn_callback   = undefined;
			this.data.id            = undefined;
			this.data.placeholder   = "Subir un archivo";
			this.data.icon 	        = "fa-cloud-upload";
            this.data.filetype      = "*";
            this.data.hdnname       = "filename_uploaded";
			this.data.value 		= "";

			$(this).addClass("cg-uploader");

			if ( $(this).attr("id") == undefined )
				$(this).attr("id", "div_display_" + unique);
			this.data.id = unique;

			if ( $(this).attr("placeholder") != undefined )
				this.data.placeholder = $(this).attr("placeholder");
			if ( $(this).attr("icon") != undefined )
				this.data.icon = $(this).attr("icon");
			if ( $(this).attr("data") != undefined )
				this.data.data = $(this).attr("data");
            if ( $(this).attr("filetype") != undefined )
                this.data.filetype = $(this).attr("filetype");
            if ( $(this).attr("hdnname") != undefined )
                this.data.hdnname = $(this).attr("hdnname");
			if ( $(this).attr("value") != undefined )
                this.data.value = $(this).attr("value");
			

			$(this).attr("data-toggle"   , "tooltip");
			$(this).attr("data-placement", "top");
			$(this).attr("title"         , this.data.placeholder);

			var htmlContent = '<div class="dv_content">';
				htmlContent += this.data.placeholder;
				htmlContent += '<i class="icon ' + this.data.icon + '" aria-hidden="true"></i>';
				htmlContent += "</div>";
                if ( this.data.hdnname != '' ) {
                    htmlContent += '<input type="hidden" id="hdn_input_'+this.data.id+'" name="'+this.data.hdnname+'" value="'+this.data.value+'">';
                }
				$(this).html( htmlContent );
				if ( $(this).attr("callback") != undefined )
					this.data.fn_callback = $(this).attr("callback");
			$(this).click( function () {
				CG_COMPONENTS.upload( this.data );
			});
		}
	});
}

$(document).ready(function(){
	$(".well").cg_uploader();
	CG_COMPONENTS.upload_load_view(); 
});


