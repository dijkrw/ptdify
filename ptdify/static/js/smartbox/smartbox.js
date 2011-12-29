var searchterms = {"query": []};
var currentParamIndex = 0;

function LinkedList() {
    this._length = 0;
    this._head = null;
}
LinkedList.prototype = {

    add: function (data){

        //create a new node, place data in
        var node = {
                data: data,
                next: null
            },

            //used to traverse the structure
            current;

        //special case: no items in the list yet
        if (this._head === null){
            this._head = node;
        } else {
            current = this._head;

            while(current.next){
                current = current.next;
            }

            current.next = node;
        }

        //don't forget to update the count
        this._length++;

    },
    
    item: function(index){

        //check for out-of-bounds values
        if (index > -1 && index < this._length){
            var current = this._head,
                i = 0;

            while(i++ < index){
                current = current.next;
            }

            return current.data;
        } else {
            return null;
        }
    },

    remove: function(index){

        //check for out-of-bounds values
        if (index > -1 && index < this._length){

            var current = this._head,
                previous,
                i = 0;

            //special case: removing first item
            if (index === 0){
                this._head = current.next;
            } else {

                //find the right location
                while(i++ < index){
                    previous = current;
                    current = current.next;
                }

                //skip over the item to remove
                previous.next = current.next;
            }

            //decrement the length
            this._length--;

            //return the value
            return current.data;            

        } else {
            return null;
        }

    },

    output: function() {
	    var current = this._head;
	    var i=0;
            while(i < this._length){
		console.info(current.data.output());    
                current = current.next;
		i++;
		}
	}	
};

function metaBlock(name) {
	this.name = name;
	}	
metaBlock.prototype.output = function() {
	return this.name;
	}	

var list = new LinkedList();
list.add(new metaBlock("red"));
list.add(new metaBlock("orange"));
list.add(new metaBlock("yellow"));

list.output();

/**
	This function reads a json response item and returns html for the autocompletion
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

function getSearchData(req) {
	
	searchterms.query[currentParamIndex] = [req.term, "New"];
	return searchterms;
}

$(function($) {
	console.info(autocompleteUrl);
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
			.autocomplete({
				minLength: 0,

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
				select: function( event, ui ) {
					searchterms.query = [];
					$('#searchtags ul').empty();
					currentParamIndex = 0;
					$.each(ui.item, function(key, val) {
						if(key>=0 && val!== undefined) {
						 	$('#searchtags ul').append("<li>"+val[0]+"</li>");					
						 	searchterms.query.push([val[0], val[1]]);
						 	currentParamIndex++;
						}
					});				
					this.value = "";
					return false;
				}
			}).data( "autocomplete" )._renderItem = function( ul, item ) {
	
			parsedData = itemToHTML(item);
	
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( parsedData.htmlValue )
				.appendTo( ul );
			};
	});
