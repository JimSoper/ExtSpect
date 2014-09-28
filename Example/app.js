Ext.Loader.setConfig( { enabled : true } );

Ext.Loader.setPath( { uxExtSpect : '../../ExtSpect' } );

Ext.application(
	{  name : 'ExtSpectExample' ,
		requires : [ 'uxExtSpect.ExtSpect' ] ,
		launch : function ()
		{ Ext.Viewport.add( Ext.create( 'uxExtSpect.ExtSpect' , { app : ExtSpectExample.app } ) ) }
	}
);
