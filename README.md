# uploader
Componente simple para subir archivos al servidor


La librería permite el upload de archivos al servidor de manera asíncrona

Para su implementación es necesario incluir los archivos

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js"></script> 
    <script src="http://malsup.github.com/jquery.form.js"></script> 
    
 Adicionalmente hace uso de la librería gráfica de bootstrap y awesome icon, El estilo propio del componente se define
 
 <code>
  <style>
  .cg-uploader {
	  background-color: #FFF;
    color: #999;
    padding: 10px;
  }
  .cg-uploader .icon {
	  float:right;
  	font-size:1.6em;
  }
  .progress {
	  margin-bottom:0px;
  }
  </style>
 </code>
 
 finalmente la declaración del html del componente es
 
<code>
  <div class="well" placeholder="Subir archivo (07/2016)" data="07/2016" component="cg-upload" callback="DOCUMENTATION.ivas" icon="fa-cloud-upload" filetype="*"  >&nbsp;</div>
</code>
