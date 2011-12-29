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
    
    size: function() {
	    return this._length;
	    },
    
    reset: function() {
	    this._head = null;
	    this._length = 0;
	    this.current = null;
	    },

	/**
	* Converts the list into an array.
	* @return {Array} An array containing all of the data in the list.
	* @method toArray
	*/
	    toArray: function(){
		    var searchterms = {"query": []};
		var result = [],
		    current = this._head;
		
		while(current){
		    searchterms.query.push( [current.data.content, current.data.type]);
		    current = current.next;
		}
		console.info(searchterms);
		return searchterms;
	    },
    
	/**
	* Converts the list into a string representation.
	* @return {String} A string representation of the list.
	* @method toString
	*/
	    toString: function(){
		return this.toArray().toString();
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

function metaBlock(content, type) {
	this.content = content;
	this.type = type;
	}	
metaBlock.prototype.output = function() {
	return "content:"+this.content+" type:"+this.type;
	}	

var list = new LinkedList();

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
	//Check if last item is of type "New"
	lastItem = list.item(list.size()-1);
	if(lastItem && lastItem.type == "New") {
		list.item(list.size()-1).content = req.term;
	} else {
		list.add(new metaBlock(req.term, "New"));	
	}
	return list.toArray();
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
					list = new LinkedList();
					$.each(ui.item, function(key, val) {
						if(key>=0 && val!== undefined) {
							list.add(new metaBlock(val[0], val[1]));
							list.output();
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
