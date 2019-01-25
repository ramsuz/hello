import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import $ from 'jquery';

let sortOrdering = {};

export class DatatableScroll {
	@bindable datarow;
	@bindable title;
	@bindable fullSearchResults;
	@bindable searchResults;
	@bindable searchTrigger;
	@bindable rowId;
	@bindable disableflag;

	constructor(){
		this.disableflag = false;
		this.resultSize = 100;
		this.heightDifferenceToScroll = 500;
		this.scrollDiv = null;
	}

	scrollTable(evt){
		if(this.searchResults && this.searchResults != null && this.fullSearchResults && this.fullSearchResults != null){
			this.scrollDiv = evt.target;
			if(evt.target.scrollHeight - this.heightDifferenceToScroll <= evt.target.scrollTop){

				if(this.searchResults.length < this.fullSearchResults.length){
					let endLength = Math.min(this.searchResults.length + this.resultSize, this.fullSearchResults.length);
					let subset = this.fullSearchResults.slice(this.searchResults.length, endLength);
					this.searchResults = this.searchResults.concat(subset);
				}
			}
		}
	}

	attached(){
		$('body').tooltip({
			trigger : 'hover',
			selector : '[data-toggle="tooltip"]',
			container : 'body',
			template : '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" ></div></div>',
			html : true,
			placement : 'bottom'
		});
	}

	detached(){
		$('.tooltip').remove();
		//$('[data-toggle="tooltip"]').tooltip('destroy'); //do not use this
	}

	rowClick(row, id){ //may require event aggregate to pass values to parent
		this.searchResults.forEach(x => x.isSelected = false);
        this.searchResults.filter(x => x[id] === row[id])[0].isSelected = true;
        if(this.datarow.selectedRowFunction) this.datarow.selectedRowFunction(row);

		return true;
	}

	rowDblClick(row, id){
		if(this.datarow.selectedRowDblClickFunction) this.datarow.selectedRowDblClickFunction(row);

		return true;
	}

	inputKeydown(event, index){
		if(this.datarow.columns[index].keydownFunction) return this.datarow.columns[index].keydownFunction(event);
		return true;
	}

	button(row){
		this.datarow.button(row);
	}

	html(row){
		if(this.datarow.htmlClickFunction) return this.datarow.htmlClickFunction(row);
	}

	sortColumn(col){
		if(this.scrollDiv != null){
			this.scrollDiv.scrollTop = 0
		}
		if(this.datarow.selectedHeaderRowFunction){
			this.datarow.selectedHeaderRowFunction(col); //if view-model uses value converters and sort
			return;
		}

		if(typeof sortOrdering.order === 'undefined') sortOrdering.order=1; //ascending

		if(sortOrdering.property===col.property){
			sortOrdering.order *= -1;
		} else {
			sortOrdering.property=col.property;
			sortOrdering.order = 1;
		}

		$("#sortState").remove();
		if(sortOrdering.order>0)
			$( '<span id="sortState" class="glyphicon glyphicon-chevron-up pull-right"></span>' ).appendTo( '#'+col.property );
		else if(sortOrdering.order<0)
			$( '<span id="sortState" class="glyphicon glyphicon-chevron-down pull-right"></span>' ).appendTo( '#'+col.property );

		if(this.fullSearchResults && this.fullSearchResults != null){
			this.fullSearchResults.sort(function(a,b){
				var sortOrder = 0;
				if(a[col.property] && b[col.property])
					sortOrder = String.prototype.localeCompare.call(a[col.property], b[col.property], 'kn', {numeric:true});
				else if(!a[col.property] && b[col.property])
					sortOrder = 1;
				else if(!b[col.property] && a[col.property])
					sortOrder = -1;
				else
					sortOrder = 0;

				return sortOrder * sortOrdering.order;
			});
			this.searchResults = this.fullSearchResults.slice(0, this.resultSize);
		}else{
			if(this.searchResults){
				this.searchResults.sort(function(a,b){
					var sortOrder = 0;
					if(a[col.property] && b[col.property])
						sortOrder = String.prototype.localeCompare.call(a[col.property], b[col.property], 'kn', {numeric:true});
					else if(!a[col.property] && b[col.property])
						sortOrder = 1;
					else if(!b[col.property] && a[col.property])
						sortOrder = -1;
					else
						sortOrder = 0;

					return sortOrder * sortOrdering.order;
				});
			}
		}

	}

}
