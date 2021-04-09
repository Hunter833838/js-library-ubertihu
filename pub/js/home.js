"use strict"

function toggleH2(){
	let sorted = document.getElementById("sorted")
	let unsorted = document.getElementById("unsorted")
	if (sorted.style.display == "none"){
		sorted.style.display=""
		unsorted.style.display="none"
	}
	else{
		sorted.style.display="none"
		unsorted.style.display=""
	}
}