/**
 * Object representing a meta-block 
 */
function metaBlock(content, type) {
	this.content = content;
	this.type = type;
	}	
metaBlock.prototype.output = function() {
	return "content:"+this.content+" type:"+this.type;
	}	

/**
	This function reads a json response item and returns html for the autocompletion
	TODO: re-write using the linkedlist structure
*/
function itemToHTML(data) {
	data.htmlValue = "<a>";
	$.each(data, function(key, val) {
		if(key >= 0 && val != undefined) { 
			data.htmlValue += "<span>"+val[0]+": "+val[1]+"</span>";
		}

	});
	data.htmlValue += "</a>";			
	return data;
}

/**
 * Prepares the list of meta-blocks for the Ajax-call. Returns an array which can be passed to the {data} attribute of {jQuery.ajax()}.
 */
function getSearchData(req) {
	//Check if last item is of type "New"
	lastItem = list.item(list.size()-1);
	if(lastItem && lastItem.type == "New") {
		list.item(list.size()-1).content = req.term;
	} else {
		list.add(new metaBlock(req.term, "New"));	
	}
	return list.toArray();
}

//Executed when document is loaded
$(function($) {
	//Initialize list of meta-blocks

	
	//Define and bind methods for smartbox
		$( "#smartbox" )
			// don't navigate away from the field on tab when selecting an item
			.bind( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
						$( this ).data( "autocomplete" ).menu.active ) {
						
					event.preventDefault();
				} else if(event.keyCode === $.ui.keyCode.ENTER) {
					console.info('enter key pressed');
				} else if(event.keyCode === $.ui.keyCode.BACKSPACE) {
					console.info('backspace key pressed');
				}
			})
			//Invoked internally by the autocompleter plugin.
			.autocomplete({
				minLength: 0,

				// {source} is a data-object which is parsed as the response item. The response here is an Ajax-call based on the searchstring which is composed from the meta-blocks.
				source:
				function(req, parseResult) {
					jQuery.ajax({
						   type: "GET",
						   url: autocompleteUrl,
						   data: getSearchData(req),
						   processData: true,
						   dataType: "json",
						   traditional: true,
						   success: function(data) {parseResult(data);}
					   });
					   }
					   ,

				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				
				//This method is invoked when an item in the dropdown menu is selected
				select: function( event, ui ) {
					//Reset list of meta-blocks
					list = new LinkedList();
					
					//Iterate through response and re-build blocks of the selection
					$.each(ui.item, function(key, val) {
						if(key>=0 && val!== undefined) {
							list.add(new metaBlock(val[0], val[1]));
							list.output();
						}
					});				
					this.value = "";
					return false;
				}
			//Overwrites the default implementation of the autocompleter plugin. Enables us to insert custom html-elements into the response dropdown-menu.	
			}).data( "autocomplete" )._renderItem = function( ul, item ) {
	
			parsedData = itemToHTML(item);
	
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( parsedData.htmlValue )
				.appendTo( ul );
			};
	});
