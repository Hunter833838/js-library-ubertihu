"use strict";


(function(global, document) {

class BetterTable{
	constructor(table, args){
	// want to be able to accept a node object as well
	this.headers = []
	this.rows = []
	this.styles = []
	this.averages = []
	this.elementID;
	this.sortable;
	this.exportToCSV;
	this.calculateAverages;
	this.reorderColumns;
	this.dontRender;
	this.headerToSearchBy;
	this.skipParsing = false;
	this.search;

	this.parseArgs(args);
	this.tableOrID(table);

	if (!this.dontRender){
		if (!this.skipParsing){
			this.parseTableContents(this.elementID);
		}
		//console.log(parsedTable)
		this.renderTable()
	}

	}

	tableOrID(table){
		if (typeof table == "object"){
			if (table.id)
				this.elementID = table.id
			else{
				// This is the case that we don't have a table ID, just generate a random one
				let randID = Date.now().toString(20) + Math.random().toString(20).substr(2)
				table.id = randID
				this.elementID = randID
			}
		}
		else{
			this.elementID = table;
		}
	}

	// These are attributes that we saved to the table to make re-rendering (normally just when sorting) easier
	parseTableAttributes(elementID){
		// tables not in a bettertable div, therefore it isn't a better table
		let element = document.getElementById(elementID);
		if (element.sortable)
			this.sortable = true
		if (element.exportToCSV)
			this.exportToCSV = true
		if (element.calculateAverages)
			this.calculateAverages = true
		if (element.reorderColumns)
			this.reorderColumns = true
		if (element.searchBar){
			this.search = true
			this.headerToSearchBy = element.searchColumn
		}
	}

	parseArgs(args){
		if (typeof args == "undefined")
			args = {}
		
		if (args.sortable)
			this.sortable = true;
		else
			this.sortable = false

		if (args.exportToCSV)
			this.exportToCSV = true
		else
			this.exportToCSV = false

		if (args.calculateAverages)
			this.calculateAverages = true
		else
			this.calculateAverages = false

		if (args.reorderColumns)
			this.reorderColumns = true
		else
			this.reorderColumns = false

		if (args.dontRender)
			this.dontRender = true
		else
			this.dontRender = false

		if (args.search){
			this.search = true
			this.headerToSearchBy = args.search.header
		}

		if (args.tableData){
			if (args.tableData.headers && args.tableData.rows){
				this.skipParsing = true
				this.headers = args.tableData.headers
				this.rows = args.tableData.rows
			}
		}
	}

	parseTableContents(elementID){
		let oldTable = document.getElementById(elementID);
		let headersList = []
		let rowsList = []
		for (var i = 0, row; row = oldTable.rows[i]; i++) {
		   let elementList = []
		   for (var j = 0, col; col = row.cells[j]; j++) {
		     if (col.nodeName === "TH"){
		     	headersList.push(col.innerText);
		     }
		     else if (col.nodeName === "TD"){
		     	let val = parseInt(col.innerText);
				//console.log(val);
				if (isNaN(val)){
					elementList.push(col.innerText);
				}
				else{
					elementList.push(val);
				}
		     	
		     }
		   }
		   if (elementList.length != 0){
		   	rowsList.push(elementList);
		   }  
		}
		this.headers = headersList;
		this.rows = rowsList;
		return {headers: headersList, rows: rowsList}
	}

	parseRowStyles(){
		let styleList = []
		let oldTable = document.getElementById(this.elementID);
		// skip header row
		for (var i = 1, row; row = oldTable.rows[i]; i++) {
			if (row.style.display === "none")
			   	styleList.push(true)
			else
			   	styleList.push(false)
			}
		this.styles = styleList
	}

	renderTable(){
		//this.parseTableAttributes(this.elementID);

		let table = document.createElement("table");
		table.id = this.elementID;
		table.reorderColumns = true
		table.classList.add("BetterTable");
		let header = document.createElement("thead");
		let body = document.createElement("tbody");

		let headerRow = document.createElement("tr");
		for (var i = 0, headers; headers = this.headers[i]; i++){
			let headerCell = document.createElement("th");
			headerCell.appendChild(document.createTextNode(headers));
      		headerRow.appendChild(headerCell);
		}

		header.appendChild(headerRow);
		for (var i = 0, rows; rows = this.rows[i]; i++){
			let contentRow = document.createElement("tr");
			if (this.styles == [])
				;
			else{
				if (this.styles[i])
					contentRow.style.display = "none"
			}
			for (var j = 0, row; row = rows[j]; j++){
				let rowCell = document.createElement("td");
				rowCell.appendChild(document.createTextNode(row));
	   	    	contentRow.appendChild(rowCell);
			}
			body.appendChild(contentRow);
		}

		table.appendChild(header);
		table.appendChild(body);
		let tableDivName = "BT" + table.id;
		let exportButtonID = "exportButton" + table.id
		let searchBarID = "searchBar" + table.id
		if (document.getElementById(tableDivName) === null){
			let tableDiv = document.createElement("div");
			tableDiv.id = "BT" + table.id;
			tableDiv.appendChild(table);
			
			try{
			document.getElementById(this.elementID).parentNode.replaceChild(tableDiv, document.getElementById(this.elementID));
			}
			catch{
				document.body.appendChild(tableDiv)
			}
		}

		else{
			document.getElementById(this.elementID).parentNode.replaceChild(table, document.getElementById(this.elementID));
		}

		if (this.exportToCSV){
			let csvButton = document.querySelector("#BT" + table.id + " .BTButton")
			//console.log(csvButton)
			if (!csvButton)
				this.addExportCSVButton();
			table.exportToCSV = true
		}
		else{
			let csvButton = document.querySelector("#BT" + table.id + " .BTButton")
			//console.log("got here")
			if (csvButton)
				csvButton.parentElement.removeChild(csvButton)
		}

		if (this.sortable){
			this.addSortableHeaders();
			table.sortable = true
		}

		if (this.reorderColumns)
			this.addReorderableColumns();

		if (this.search){
			let searchBar = document.querySelector("#" + searchBarID)
			//console.log(csvButton)
			if (!searchBar)
				this.addSearchBar(this.headerToSearchBy);
			table.searchBar = true
			table.searchColumn = this.headerToSearchBy
		}
		else{
			let searchBar = document.querySelector("#" + searchBarID)
			//console.log(csvButton)
			// if (searchBar)
			// 	searchBar.parentElement.removeChild(searchBar)
		}


	}

	addSearchBar(headerToSearchBy){
		const elementID = this.elementID;
		//const headerToSearchBy = this.headerToSearchBy;
		let divName = "BT" + elementID;
		let tableDiv = document.getElementById(divName);
		let table = document.getElementById(elementID);
		table.search = true
		table.searchColumn = headerToSearchBy
		let searchBar = document.createElement("input");
		searchBar.placeholder = "Search by " + headerToSearchBy
		searchBar.classList.add("BTSearch");
		searchBar.id = "searchBar" + elementID

		searchBar.onkeyup = function(){ search(elementID, headerToSearchBy);}
		tableDiv.insertBefore(searchBar, table);
	}

	addRow(content){
		if ( content == null || content.length != this.headers.length){
			// we need to throw an error here
			;
		}
		else{
			this.rows.push(content);
			//this._process(this.elementID);
			this.renderTable()
		}
	}


	addColumn(header, content){
		if ( content == null || content.length != this.rows.length){
			// we need to throw an error here
			;
		}
		else{
			this.parseTableContents(this.elementID);
			this.headers.push(header);
			//console.log(this.rows.toString());
			for (var i = 0, rows; rows = this.rows[i]; i++){
				rows.push(content[i]);
			}
			//console.log(this.rows);
			//this._process(this.elementID);
			//console.log(this.rows.toString());
			this.renderTable();
		}
	}

	addExportCSVButton(){
		const elementID = this.elementID;
		let divName = "BT" + elementID;
		let tableDiv = document.getElementById(divName);
		let table = document.getElementById(elementID);
		table.exportToCSV = true;
		let csvButton = document.createElement("button");
		csvButton.innerText = "Export Table to CSV"
		csvButton.classList.add("BTButton");
		csvButton.id = "exportButton"  +  elementID;
		csvButton.onclick = function(){ toCSV(elementID);}
		tableDiv.insertBefore(csvButton, table);
	}

	addSortableHeaders(){
		let table = document.getElementById(this.elementID);
		table.sortable = true;
		let headerCells = table.querySelector("thead tr").cells;
		for (var i = 0, header; header = headerCells[i]; i++){
			let x = i;
			//console.log(x);
			header.onclick = function() {sort(x, table.id);}
		}
	}

	addReorderableColumns(){
		let table = document.getElementById(this.elementID);
		let headerCells = table.querySelector("thead tr").cells;
		for (var i = 0, headerCell; headerCell = headerCells[i]; i++){
			headerCell.draggable = true
			headerCell.addEventListener('dragstart', PickUp);
    		headerCell.addEventListener('dragenter', enterHeaderRegion);
    		headerCell.addEventListener('dragover', hoveringOverHeader);
    		headerCell.addEventListener('dragleave', leaveHeaderRegion);
    		headerCell.addEventListener('drop', Drop);
    		headerCell.addEventListener('dragend', afterDrop);
		}
	}

	calculateColumnAverages(){
		let j = 0;
		this.averages = [];
		while (j < this.rows[0].length){
			let colAvg = 0;
			for (var i = 0, row; row = this.rows[i]; i++) {
				let val = parseInt(row[j]);
				//console.log(val);
				if (isNaN(val)){
					colAvg = "N/A";
					break;
				}
				else {
					colAvg += val;
				}
			}
			//console.log(colAvg);
			colAvg = colAvg / this.rows.length;
			this.averages.push(colAvg.toFixed(1));

			j++;

		}
	}

}

function toCSV(elementID){
	let x = new BetterTable(elementID, {dontRender: true});
	let parsedTable = x.parseTableContents(elementID)
	let headers = parsedTable.headers
	let rows = parsedTable.rows
	let elements = [headers].concat(rows);
	let csvData = "";
	for (var i = 0, row; row=elements[i]; i++){
		csvData += (row.join(","));
		csvData += "\n";
	}
	// s/o to blobs for fixing the csv chrome issue
	var blob = new Blob([csvData], {type: 'text/csv'})
	var downloadCSV = document.createElement('a');
    downloadCSV.href = window.URL.createObjectURL(blob);
    downloadCSV.download = 'table.csv';
    downloadCSV.click();
}


function sort(index, elementID){
	//console.log(index)
	let x = new BetterTable(elementID, {dontRender: true});
	x.parseTableAttributes(elementID)
	x.parseRowStyles()
	let data = x.parseTableContents(elementID)
	const rowsBefore = [...x.rows];

	let rowsAfter;
	if (Number.isFinite(rowsBefore[0][index])){
		rowsAfter = x.rows.sort((a,b) => a[index]-b[index]);
		// console.log("this happened")
	}
	else{
		rowsAfter = x.rows.sort((a,b) => String(a[index]).localeCompare(String(b[index])));
	}

	if (rowsBefore.toString() === rowsAfter.toString()){
		//console.log
		rowsAfter.reverse();
	}

	x["rows"] = rowsAfter;

	x.renderTable();
}

let dragElement = null;

function PickUp(e) {
	this.classList.add('beingDragged')
	dragElement = this;
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function hoveringOverHeader(e) {
	if (e.preventDefault) {
	  e.preventDefault();
	}
	e.dataTransfer.dropEffect = 'move';
}

function enterHeaderRegion(e) {
	this.classList.add('hoveringOver');
}

function leaveHeaderRegion(e) {
	this.classList.remove('hoveringOver');
}

function Drop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    let dropElement = this
    let eid = dropElement.parentElement.parentElement.parentElement.id
    let targeteid = dragElement.parentElement.parentElement.parentElement.id
    const ogValue = dragElement.innerText;
    if (dragElement != dropElement && (eid === targeteid)) {
      dragElement.innerHTML = dropElement.innerHTML;
      dropElement.innerHTML = e.dataTransfer.getData('text/html');
      const afterValue = dragElement.innerText;
      let eid = e.srcElement.parentNode.parentNode.parentNode.id
      let targeteid = e.target.parentNode.parentNode.parentNode.id
      let x = new BetterTable(eid, {dontRender: true});
      x.parseTableContents(eid)
      x.parseTableAttributes(eid)
      x.parseRowStyles()
      let swap1 = x.headers.indexOf(ogValue)
      let swap2 = x.headers.indexOf(afterValue)
	  var arrayLength = x.rows.length;
	  for (var i = 0; i < arrayLength; i++) {
	  	  let list = x.rows[i]
	  	  var b = list[swap1];
		  list[swap1] = list[swap2];
		  list[swap2] = b;
		  x.rows[i] = list;
		}
		x.renderTable()
    }
    dropElement.classList.remove('hoveringOver');
    dragElement.classList.remove('beingDragged')
}

function afterDrop(e) {
    dragElement.classList.remove('beingDragged')
}
    
function search(elementID, columnToSearch) {
	    // Declare variables
	    let searchBarID = "searchBar" + elementID
	    let table = document.getElementById(elementID);
	    let searchBar = document.getElementById(searchBarID);
	    let query = searchBar.value
	    query = query.toLowerCase()
	    let indexToSearch = 0
	    let rows = table.querySelectorAll("tbody tr");
	    let headerCells = table.querySelector("thead tr").cells;
	    for (var i = 0, headerCell; headerCell = headerCells[i]; i++){
	    	if (headerCell.innerText == columnToSearch){
	    		const indexOfHeader = i
	    		indexToSearch = indexOfHeader
	    		break
	    	}
	    }
	    for (var j = 0; j < rows.length; j++) {
	        let td = rows[j].getElementsByTagName("td")[indexToSearch];
	        if (td) {
	            let cellVal = td.innerText;
	            if (cellVal.toLowerCase().indexOf(query) > -1) {
	                rows[j].style.display = "";
	            } else {
	                rows[j].style.display = "none";
	            }
	        }
	    }
	}

	global.BetterTable = global.BetterTable || BetterTable
})(window, window.document);