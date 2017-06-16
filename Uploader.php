<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
  Handles image upload from CKEditor
  Controlador de ejemplo en el framework de PHP CodeIgniter
**/
class Uploader extends Controller {

	/**
	 *	Upload a file in generic way
	 */
	public function upload_file () {
        
        // Token para consumir por la APP
        $retorno 					= array();
		foreach ( $_FILES as $clave => $archivo ) {

			if ( $_FILES[$clave]['error'] != 0 ) {
				$retorno['error'] = 'Problemas con el archivo subido, error ' . $_FILES[$clave]['error'];
				echo json_encode( $retorno );
				exit;
			}

			$fileArr 			= explode('.', $_FILES[$clave]['name'] );
			$extension 			= '.' . $fileArr[ count( $fileArr ) - 1 ];

			$nombreFinalArchivo = date('Ymd_his_') . hash('crc32', date('Ymdhis').rand(100,999) , false) . '_' .  rand(100,999) . $extension;
			$dirFisica  		= FOLDER_UPLOAD_FILES . '/' . $nombreFinalArchivo;
			$urlArchivo 		= $nombreFinalArchivo ;
			$nombre_tmp 		= $_FILES[$clave]["tmp_name"];

			if ( move_uploaded_file($nombre_tmp, $dirFisica ) ) {
				$retorno['archivo'] = $urlArchivo;
				$retorno['nombre'] 	= $_FILES[$clave]['name'];
				$retorno['type']	= $_FILES[$clave]['type'];
				$retorno['size']	= $_FILES[$clave]['size'];
			}

		}

		header('Content-Type: application/json');
		echo json_encode( $retorno );
	}
}
