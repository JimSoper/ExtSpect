

Ext.define(
	'uxExtSpect.view.ExtSpectNavigationView',
	{  extend: 'Ext.navigation.View',
		isExtSpectNavigationView: true,
		defaultIdPrefix: 'es',
		dataListStoreName: null,

		config: { rootObject: Ext.Viewport },

		fetchDataLists: function () {
			return this.query( '[isExtSpectDataList=true]' );
		}
	}
);
