"use strict";

// can check and see if headers have an onclick meaning it should be sortable
// can check and see if csv button exists, therefore we need to make another one


class BetterTable{
	constructor(elementId, sortable = false, exportToCSV = false, calculateAverages = false){
		let result = check(elementId);

		this.headers = [];
		this.rows = [];
		this.averages = [];
		this.elementID = elementId;
		this.sortable = sortable;
		this.exportToCSV = exportToCSV;
		this.calculateAverages = calculateAverages;
		
		this._process(elementId);
		this._createTable();

		if (sortable){
			this.sortableHeaders();
		}

		if (exportToCSV){
			this.addExportCSVButton();
		}

		// just tell em they have to change element id before creating new one
		if (result.sortable){
			this.sortableHeaders();
		}
		// if (result.exportToCSV){
		// 	this.addExportCSVButton();
		// }
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
					colAvg = "None";
					break;
				}
				else {
					colAvg += val;
				}
			}
			//console.log(colAvg);
			colAvg = colAvg / this.rows.length;
			this.averages.push(colAvg);

			j++;

		}
	}

	// displayColumnAverages(){
	// 	let table = document.getElementById(this.elementID);
	// 	let headerCells = table.querySelector("thead tr").cells;
	// 	for (var i = 0, header; header = headerCells[i]; i++){
	// 		let x = i;
	// 		console.log(x);
	// 		header.onclick = function() {sort(x, table.id);}
	// 	}
	// }

	_process(elementID){
		// have case if element is already a betterTable - might need cases for styling, maybe not
		let oldTable = document.getElementById(elementID);
		for (var i = 0, row; row = oldTable.rows[i]; i++) {
		   let elementList = []
		   for (var j = 0, col; col = row.cells[j]; j++) {
		     if (col.nodeName === "TH"){
		     	this.headers.push(col.innerText);
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
		   	this.rows.push(elementList);
		   }  
		}
	}

	_createTable(){

		// console.log(csvButton);
		let table = document.createElement("table");
		table.id = this.elementID;
		table.classList.add("BetterTable");
		let header = document.createElement("thead");
		let body = document.createElement("tbody");

		let headerRow = document.createElement("tr");
		for (var i = 0, headers; headers = this.headers[i]; i++){
			let headerCell = document.createElement("th");
			headerCell.appendChild(document.createTextNode(headers));
			// I don't know why we need this step but I guess we do
			// let x = i;
			// // console.log(i);
			// headerCell.onclick = function() {sort(x, table.id); }
      		headerRow.appendChild(headerCell);
		}
		// console.log(headerRow);
		header.appendChild(headerRow);

		for (var i = 0, rows; rows = this.rows[i]; i++){
			let contentRow = document.createElement("tr");
			for (var j = 0, row; row = rows[j]; j++){
				// console.log(row);
				let rowCell = document.createElement("td");
				rowCell.appendChild(document.createTextNode(row));
	   	    	contentRow.appendChild(rowCell);
			}
			body.appendChild(contentRow);
		}

		

		table.appendChild(header);
		table.appendChild(body);
		// csvButton.onClick = this.exportToCSV();
		let tableDivName = "BT" + table.id;
		if (document.getElementById(tableDivName) === null){
			

			let tableDiv = document.createElement("div");
			tableDiv.id = "BT" + table.id;
			// tableDiv.appendChild(csvButton);
			tableDiv.appendChild(table);

			document.getElementById(this.elementID).parentNode.replaceChild(tableDiv, document.getElementById(this.elementID));
		}

		else{
		//console.log(table);
			document.getElementById(this.elementID).parentNode.replaceChild(table, document.getElementById(this.elementID));
		//this.sortable();
		}
	}

	sortableHeaders(){
		let table = document.getElementById(this.elementID);
		let headerCells = table.querySelector("thead tr").cells;
		for (var i = 0, header; header = headerCells[i]; i++){
			let x = i;
			//console.log(x);
			header.onclick = function() {sort(x, table.id);}
		}
	}

	// exportToCSV(){
	// 	const elementID = this.elementID;
	// 	let divName = "BT" + elementID;
	// 	let tableDiv = document.getElementById(divName);
	// 	let table = document.getElementById(elementID);
	// 	let csvButton = document.createElement("button");
	// 	csvButton.innerText = "Export Table to CSV"
	// 	csvButton.onclick = function(){ exportTableAsCSV(elementID)}
	// 	tableDiv.insertBefore(csvButton, table);
	// }


	addRow(content){
		if ( content == null || content.length != this.headers.length){
			// we need to throw an error here
			;
		}
		else{
			this.rows.push(content);
			//this._process(this.elementID);
			this._createTable();
			if (this.sortable){
				this.sortableHeaders();
			}
		}
	}

	addColumn(header, content){
		if ( content == null || content.length != this.rows.length){
			// we need to throw an error here
			;
		}
		else{
			this.headers.push(header);
			//console.log(this.rows.toString());
			for (var i = 0, rows; rows = this.rows[i]; i++){
				rows.push(content[i]);
			}
			//console.log(this.rows);
			//this._process(this.elementID);
			//console.log(this.rows.toString());
			this._createTable();
		}
	}

	addExportCSVButton(){
		const elementID = this.elementID;
		let divName = "BT" + elementID;
		let tableDiv = document.getElementById(divName);
		let table = document.getElementById(elementID);
		let csvButton = document.createElement("button");
		csvButton.innerText = "Export Table to CSV"
		csvButton.classList.add("BTButton");
		csvButton.onclick = function(){ toCSV(elementID);}
		tableDiv.insertBefore(csvButton, table);
		// let elements = [this.headers].concat(this.rows);
		// let content = "data:text/csv;charset=utf-8,";
		// // elements.push(this.header);
		// // console.log(elements);
		// let csvData = "";
		// for (var i = 0, row; row=elements[i]; i++){
		// 	csvData += row.join(",");
		// 	csvData += "\n";
		// }
		// content += encodeURI(csvData);
		// // console.log(content);
		// return content;
	}

}

function sort(index, elementID){
		//console.log(index)
		let x = new BetterTable(elementID);
		const rowsBefore = [...x.rows];
		//if (parseInt(rowsBefore[0][index])) {
			//let rowsAfter = x.rows.sort((a,b) => (a[index] - b[index]));
		//}
		//else {
		// Need to fix case where numbers might be strings
		let rowsAfter;
		if (Number.isFinite(rowsBefore[0][index])){
			rowsAfter = x.rows.sort((a,b) => a[index]-b[index]);
			console.log("this happened")
		}
		else{
			rowsAfter = x.rows.sort((a,b) => a[index].localeCompare(b[index]));
		}
		//}
		//console.log(x.rows.toString());
		//console.log(rowsAfter.toString());
		if (rowsBefore.toString() === rowsAfter.toString()){
			//console.log
			rowsAfter.reverse();
		}

		//console.log(x.rows.toString());
		x["rows"] = rowsAfter;
		//console.log(x.rows);
		//console.log(rowsAfter);
		x._createTable();
		//console.log(x.rows.toString());
		x.sortableHeaders();
}


function toCSV(elementID){
	console.log("executed");
	console.log(elementID);
	let x = new BetterTable(elementID);
	let elements = [x.headers].concat(x.rows);
	let content = "data:text/csv;charset=utf-8,";
	// elements.push(this.header);
	// console.log(elements);
	let csvData = "";
	for (var i = 0, row; row=elements[i]; i++){
		csvData += row.join(",");
		csvData += "\n";
	}
	content += encodeURI(csvData);
	// console.log(content);
	console.log(content);
	var downloadCSV = document.createElement('a');
    downloadCSV.href = content
    // downloadCSV.target = '_blank';
    downloadCSV.download = 'table.csv';
    downloadCSV.click();

	// return content;
	// return ("data:text/csv;charset=utf-8,Company,Contact,Country%0AAlfreds%20Futterkiste,Maria%20Anders,Germany%0ACentro%20comercial%20Moctezuma,Francisco%20Chang,Mexico%0AErnst%20Handel,Roland%20Mendel,Austria%0AIsland%20Trading,Helen%20Bennett,UK%0ALaughing%20Bacchus%20Winecellars,Yoshi%20Tannamuri,Canada%0AMagazzini%20Alimentari%20Riuniti,Giovanni%20Rovelli,Italy%0A")
}

function check(elementID){
	let divName = "BT" + elementID;
	let tableDiv = document.getElementById(divName);
	let sortable = false;
	let exportToCSV = false;
	let calculateAverages = false;
	let brandNewTable = false
	if (tableDiv === null){
		return {sortable, exportToCSV, calculateAverages, brandNewTable: true};
	}
	if (tableDiv.querySelector('th').onclick === null){
		sortable = false;
	}
	else{
		sortable = true;
	}
	if (tableDiv.querySelector('button') === null){
		exportToCSV = false;
	}
	else{
		exportToCSV = true;
	}
	return {sortable, exportToCSV, calculateAverages, brandNewTable};
}

// bug when adding row/ column

// function BetterTable(elementID){
// 	this.headers = [];
// 	this.rows = [];
// 	this._process(elementID);
// }


// BetterTable.prototype = {

// 	_process: function(elementID) {
// 		let oldTable = document.getElementById(elementID);
// 		for (var i = 0, row; row = oldTable.rows[i]; i++) {
// 		   //iterate through rows
// 		   //rows would be accessed using the "row" variable assigned in the for loop
// 		   let elementList = []
// 		   for (var j = 0, col; col = row.cells[j]; j++) {
// 		     //iterate through columns
// 		     //columns would be accessed using the "col" variable assigned in the for look
// 		     if (col.nodeName === "TH"){
// 		     	this.headers.push(col.innerText);
// 		     }
// 		     else if (col.nodeName === "TR"){
// 		     	elementList.push(col.innerText)
// 		     }
// 		   }
// 		   if (elementList.length != 0){
// 		   	rows.push(elementList);
// 		   }  
// 		}
// 		// process(elementID);
// 		console.log(this.headers);
// 		console.log(this.rows);
// 	}
// }