function copyToClipboard(elemId) {
	/* This function copies content inside div with id elemId 
		Ref: https://stackoverflow.com/questions/36639681/how-to-copy-text-from-a-div-to-clipboard  */
	
	if(document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(elemId));
		range.select().createTextRange();
		document.execCommand("copy");
	}
	else if(window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(elemId));
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		document.execCommand("copy");
		//alert("Text has been copied, now paste in text area");
	}
}


function openTicket() {
	var ticketNo = prompt("Enter ticket number:");
	if(ticketNo != null && ticketNo != "") {
		var link = "https://spc.ondemand.com/open?ticket="+ticketNo.trim();
		window.open(link);
	}
}


function openSapNote() {
	var sapNoteNo = prompt("Enter SAP NOTE: ");
	if(sapNoteNo != null && sapNoteNo != "") {
		var sapNoteLink = "https://launchpad.support.sap.com/#/notes/"+sapNoteNo.trim();
		window.open(sapNoteLink);
	}
}


function addSapNote() {
	pullCategories();
	document.getElementById('addSapNote').style.display = "block";
}




