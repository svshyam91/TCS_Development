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
	document.getElementById('addSapNote').style.display = "block";
}


function showStatus(statusCode) {


	// Alert Text based on status code
	if(statusCode == 0) {
		var alertText = "Success!! Data updated successfully.";
	}
	else {
		var alertText = "Failed!! Something went wrong.";
	}

	var alertBox = document.getElementById('statusAlert');

	// Add alert status text
	document.getElementById('statusAlert').innerHTML = alertText;

	// Display alert box.
	alertBox.style.display = "block";

	// Hide alert box after 5 seconds 
	setTimeout(function() {
		document.getElementById("statusAlert").style.display = "none";
	}, 5000);
}


function displayNoteContent(elementId) {
	/* 
		This function hides/displays .note-content and changes the angle(arrow) of the button.
		Later, replace this code with jQuery code(using delegate).
	*/
	
	// Get elements
	
	preDisplay = document.getElementById("noteContent"+elementId).style.display;
	angle = document.getElementById("udAngle"+elementId);

	// Use toggle() method of JS to change this code later
	if(preDisplay == "none") {
		preDisplay = "block";
		
		// Change down arrow to up
		angle.classList.remove("fa-angle-double-down");
		angle.classList.add("fa-angle-double-up");
	}
	else if(preDisplay == "block") {
		preDisplay = "none";

		// Change up arrow to down
		angle.classList.remove("fa-angle-double-up");
		angle.classList.add("fa-angle-double-down");
	}
	document.getElementById("noteContent"+elementId).style.display = preDisplay;
}

function changeCategoryBtnStyle(categoryId) {
	console.log("You are in changeCategoryBtnStyle");
	$(".category-sidebar-btn").removeClass("selected-category");
	$("#"+categoryId).addClass("selected-category");
}


// jQuery Code
$(document).ready(function() {

	$("#editCategory").click(function() {

		// Blur backgroud div
		$("#categorySideBar").css("filter","blur(5px)");

		// Display input div
		$("#editInputDiv").css("width","100%");

		// Disable pointer-events to backgroud div
		$("#categorySideBar").css("pointer-events","none");
		
	});

	$("#closeInputBtn").click(closeInputBtn);
	function closeInputBtn() {
		// Hide input div
		$("#editInputDiv").css("width","0");

		// Remove blur of backgroud
		$("#categorySideBar").css("filter","blur(0px)");

		//Enable pointer-events to background div
		$("#categorySideBar").css("pointer-events","auto");
	}

	$("#deleteCategory").click(function() {

		// Blur backgroud div
		$("#categorySideBar").css("filter","blur(5px)");

		// Display Delete div
		$("#deleteInputDiv").css("width","100%");

		// Disable pointer-events to backgroud div
		$("#categorySideBar").css("pointer-events","none");

	});

	// Close Delete Button
	$("#closeDeleteBtn").click(closeDeleteBtn);
	function closeDeleteBtn() {
		// Hide Delete Div
		$("#deleteInputDiv").css("width","0");

		// Remove blur of background
		$("#categorySideBar").css("filter","blur(0px)");

		//Enable pointer-events to background div
		$("#categorySideBar").css("pointer-events","auto");
	}

	// Edit Category button
	$("#editCategorySubmitBtn").click(function() {
		editCategory();
		closeInputBtn();
	})

	// Delete Category Submit 
	$("#deleteCategorySubmitBtn").click(function() {
		categoryId = $("#deleteCategory").attr("categoryId");
		deleteCategory(categoryId);
		showStatus(0);
		closeDeleteBtn();
	})
});

// This function runs when the page is fully loaded
$(document).ready(function(){
	// Show loader div for categories

	$("#loaderDiv").show();
	pullCategories();
});
function hideLoaderDiv() {
	$("#loaderDiv").hide();
}