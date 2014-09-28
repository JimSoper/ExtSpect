Ext.define(
	'uxExtSpect.view.ExtSpectDataList',
	{  extend: 'Ext.dataview.List',
		isExtSpectDataList: true,
		defaultIdPrefix: 'es',

		config: {
			itemTpl: '{text}',
			rootObject: Ext.Viewport,
			emptyText: "NO DATA",

			useSimpleItems: true, // Touch 2.2.0+
			// variableHeights: true, // Touch 2.2.0
			// infinite: true, // Touch 2.2.0, breaks 231. This is death.

			itemHeight: 18, // added for Touch 2.2
			// This becomes style="min-height:18px !important!" in the elements

			listeners: {
				itemsingletap: function () { this.handleItemSingleTap.apply( this, arguments ); },
				itemdoubletap: function () { this.handleItemDoubleTap.apply( this, arguments ); },
				painted: function () { this.handlePainted.apply( this, arguments ); }
			}
		},

		initialize: function () {
			this.callParent( arguments );
//			console.log( arguments.callee.displayName )
			var domElmnt = this.element.dom
			// console.log( arguments.callee.displayName, 'domElmnt=', domElmnt );
//			document.addEventListener( 'scroll', function () { console.log( 'scroll event') } , false )
			domElmnt.onmousewheel = this.handleWheel // Chrome(y), MSIE9(y), Maxthon 3(y), FF 31(n)
			domElmnt.onwheel = this.handleWheel // NEEDED FOR FF 31(y)
			domElmnt.extComponent = this
		},

		handleWheel: function ( wheelEvent ) {
//			var domElmnt = wheelEvent.target || wheelEvent.srcElement // srcElement is for MSIE

			var wheelDelta = wheelEvent.wheelDelta // negative is down, 120px
			// MSIE 9-11(y), Maxthon 3 (y), Chrome (y), FF (n)

//			var wheelDeltaY = wheelEvent.wheelDeltaY // negative is down, 120px
			// MSIE 11(n), FF (n),  Maxthon 3 (y), Chrome (y)

			var deltaY = wheelEvent.deltaY // negative is UP, 100px
			//  MSIE 11(n), Maxthon 3(n), Chrome (y), FF (y, x3, deltaMode =3)

//			console.log( 'wheel event', wheelEvent )
//			console.log( 'wheel event', 'wheelDelta=', wheelDelta, 'wheelDeltaY=', wheelDeltaY,
//			             'deltaY=', deltaY , wheelEvent.deltaMode)

			// 'this' is the DOM element, except in MSIE(?)
			// in MS IE,'this' may not be the element with the event method
			var container = this.extComponent

			// http://docs.sencha.com/touch/2.1.1/#!/api/Ext.scroll.Scroller
			var scroller = container.getScrollable().getScroller()
			// scrlr.slotSnapSize = { x: 0, y : 5 }
			if ( wheelEvent.deltaMode ) // FF 31. Normally deltaMode is 0
			{ scroller.scrollBy( 0, deltaY * 20, true ) } // deltaY = 3
			else { scroller.scrollBy( 0, 0 - wheelDelta / 2, true ) } // wheelDelta = 120
		},

		isFunction: uxExtSpect.util.StringOf.isFunction,

		isClass: uxExtSpect.util.StringOf.isExtClass,

		valueStringOf: function ( value ) {
			return  uxExtSpect.util.StringOf.to$( value );
		},

		fetchParentNavigationView: function () {
			return this.up( '[isExtSpectNavigationView]' );
		},

		fetchObjectNavigationView: function () {
			return Ext.ComponentQuery.query( 'objectnavigationview' )[ 0 ];
		},

		fetchParentTabPanel: function () {
			return this.up( '[isExtSpectTabPanel]' );
		},

		fetchRootObject: function () {
			var tabPanel = this.fetchParentTabPanel();
			var rootObject = tabPanel.fetchRootObject();
			return rootObject;
		},

		// ========== handlePainted

		handlePainted: function () { this.computeAndSetData(); },

		computeAndSetData: function () {
//			console.log( arguments.callee.displayName );
			var previousStore = this.getStore();
			if ( previousStore )
			{ Ext.StoreManager.unregister( previousStore ); }

			this.determineAndSetIndexBar();
			var rowObjects = this.collectRowObjects();
			// rowObjects.forEach( this.setRowString, this );
			var storeName = this.determineStoreName();
			var store = Ext.create( storeName );
			store.setData( rowObjects );
			this.setStore( store );
		},

		determineStoreName: function () {
			var storeName = this.storeName || this.fetchParentNavigationView().dataListStoreName;
			return storeName;
		},

		// An instance here is defined as an object with a named constructor
		// The Instance must have at least 1 property
		// A config object is not an instance, nor is a RegEx
		isInstance: function ( value ) {
			var result =
				    (  ( value instanceof Object ) &&
					    ( uxExtSpect.util.StringOf.constructorName( value ) !== '' ) &&
					    ( ! ( value instanceof RegExp ) ) &&
					    ( ! ( value instanceof HTMLElement ) ) && // many Ext.Loader.scriptElements
					    // ( ! this.isExtObject( value ) ) &&
					    ( uxExtSpect.util.StringOf.propertyCount( Object ) > 0 )
					    );
			return result;
		},

		extCollectionToArray: function ( collection ) {
			return collection.items; // 5/28/13
		},

		htmlCollectionToArray: function ( collection ) {
			var array = [];
			for ( var len = collection.length , index = 0; index < len; index ++ )
			{
				array.push( collection.item( index ) );
			}
			return array;
		},

		handleItemDoubleTap: function ( dataview, index, listItem, record ) {
			console.log( arguments.callee.displayName );
			this.handleItemSingleTap( dataview, index, listItem, record )
		}
	}
);

/*
 setTabBadge : function ( )
 {	var title = this.paraent.title
 var query = '[title="' + title + '"]'
 var TabButtons = Ext.ComponentQuery.query( title )
 for ( var len = TabButtons.length , index = 0 ; index < len ; index ++ )
 {	var component = TabButtons[ index ]
 if ( "setBadgeText" in component )
 {	component.setBadgeText( "99" ) }
 }
 var tabPanel = this.up( '.'+ this.panelXtype )
 tabPanel = Ext.ComponentQuery.query( '.'+ this.panelXtype )[0]

 tabButton.setBadgeText()
 }
 */
