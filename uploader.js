
// MI LIBRERIA UPLOAD PERSONAL

// Inicialización del spacename
var CG_COMPONENTS = CG_COMPONENTS || {};

CG_COMPONENTS.params = {
	tiempo_cambio : 1000
};

// Funcion mejorada del upload para el componenete especiazado
CG_COMPONENTS.upload = function ( component_caller ) {

	// Inicio de las variables
	var nombreArchivoNuevo	= '';
	var attrFileTypeLimit   = 'filetype="*"';
	var html  = '<form method="POST" action="/Uploader/upload_file" style="display:none" id="frm__new_file_to_upload" enctype="multipart/form-data">';
		html += '   <input type="file" name="filetoupload" id="file__new_file_to_upload" value="" '+attrFileTypeLimit+' >';
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
			$.get( '/Uploader/returnNewToken', function( _secure ) {
				$("input[name="+_secure.token.name+"]").val(_secure.token.hash);
				if (xhr.responseJSON['archivo'] != undefined) {
					// Marca OK
					var loader =  '<div class="progress">';
						loader += '<div id="div_progress_'+component_caller.id+'" class="progress-bar progress-bar-success progress-bar-striped active" style="width: 100%">';
						loader += '</div></div>';
					$("#div_display_"+component_caller.id).find(".dv_content").html( loader );
					// Mesaje final del proceso
					setTimeout(function(){
						var htmlContent  = '<span class="text-success">' + responseText.nombre + '</span>';
							htmlContent += '<i class="icon fa ' + component_caller.icon + '" aria-hidden="true"></i>';
						$("#div_display_"+component_caller.id).find(".dv_content").html( htmlContent );
					}, CG_COMPONENTS.params.tiempo_cambio);
					// Llamada a la función externa
					if (component_caller.fn_callback != undefined) {
						try {
							eval( component_caller.fn_callback + " (responseText, component_caller)" );
						} catch (error) {
							alert("Error en la declaración de la función de retorno: " + error);
						}
					}
				}
			});
		},
		error : function ( error ) {
			// Template progreso error
			var loader =  '<div class="progress">';
				loader += '<div id="div_progress_'+component_caller.id+'" class="progress-bar progress-bar-danger progress-bar-striped active" style="width: 100%">';
				loader += '</div></div>';
			$("#div_display_"+component_caller.id).find(".dv_content").html( loader );
			// Nuevo token
			$.get('/Uploader/returnNewToken', function ( _secure ) {
				$("input[name="+_secure.token.name+"]").val(_secure.token.hash);
			});
			// Depliega el mensaje por pantalla
			setTimeout(function(){
				var htmlContent  = '<span class="text-danger"><strong>Error almacenando su archivo</strong></strong>';
					htmlContent += '<i class="icon fa ' + component_caller.icon + '" aria-hidden="true"></i>';
				$("#div_display_"+component_caller.id).find(".dv_content").html( htmlContent );
			}, CG_COMPONENTS.params.tiempo_cambio);
		}
	});


	// Gatilla la accion de cambio en el componente
	$("#file__new_file_to_upload").change(function(){
		$.get('/Uploader/returnNewToken', function( _secure ){
			var html = '   <input type="hidden" name="' + _secure.token.name + '" value="'+ _secure.token.hash +'" >';
			$("#frm__new_file_to_upload").append( html );
			$("#file__new_file_to_upload").parent().submit();
		});
	});

	// Gatilla la ventana
	$("#file__new_file_to_upload").click();
}


$.fn.cg_uploader = function ( action ) {
	return this.each( function () {
		if ($(this).attr("component") == 'cg-upload') {

			var tiempo 				= new Date();
			var unique 				= tiempo.getTime() + '_' + Math.floor((Math.random() * 1000) + 1);

			this.data = {};
			this.data.data 			= undefined;
			this.data.fn_callback 	= undefined;
			this.data.id 		  	= undefined;
			this.data.placeholder 	= "Subir un archivo";
			this.data.icon 			= "fa-cloud-upload";

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

			$(this).attr("data-toggle","tooltip");
			$(this).attr("data-placement","top");
			$(this).attr("title",this.data.placeholder);

			var htmlContent = '<div class="dv_content">';
				htmlContent += this.data.placeholder;
				htmlContent += '<i class="icon fa ' + this.data.icon + '" aria-hidden="true"></i>';
				htmlContent += "</div>";

				$(this).html( htmlContent );

				if ( $(this).attr("callback") != undefined )
					this.data.fn_callback = $(this).attr("callback");

			$(this).click( function () {
				CG_COMPONENTS.upload( this.data );
			});
		}
	});
}

$(".well").cg_uploader();
