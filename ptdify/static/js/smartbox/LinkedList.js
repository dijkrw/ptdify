/**
* LinkedList implementation, used for meta-blocks.
* Based on https://github.com/nzakas/computer-science-in-javascript/blob/master/data-structures/linked-list/linked-list.js
*/

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
		var current = this._head;
		
		while(current){
		    searchterms.query.push( [current.data.content, current.data.type]);
		    current = current.next;
		}
		return searchterms;
	    },
    
	/**
	* Builds the meta-blocks html and injects it on the page
	*    
	*/    
	toHTML: function() {
		var current = this._head;
		var i=0;
		$(META_BLOCKS_CONTAINER).empty();
		while(i < this._length){		
			$(META_BLOCKS_CONTAINER).append(current.data.toHTML());
			current = current.next;
			i++;
		}
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