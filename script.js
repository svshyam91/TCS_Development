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


function validateAddNoteForm() {
	/* This function gets and validate data from addNote form and passes
		data to addNotes() function to update it in firebase database. */

	// Get values
	var noteCategory = document.getElementById('noteCategory');
	var noteCategoryValue = noteCategory.options[noteCategory.selectedIndex].value;
	var noteHeading = document.getElementById('noteHeading').value;
	var noteDescription = document.getElementById('noteDescription').value;

	// Validate data
	if (noteCategoryValue == "" || noteHeading == "" || noteDescription == "" ) {
		alert("Please fill form before submitting.");
		return;
	}
	pushNotesOfCategory(noteCategoryValue, noteHeading, noteDescription);		/* File: firebase.js */
}


function validateChangeNote() {
	/* 
		This function validates data filled in changeNote form and passes data to pushChangeNote()
		in firebase.js file.
	*/

	// Get Values of form fields
	noteHeading = document.getElementById('changeNoteHeading').value;
	noteDescription = document.getElementById('changeNoteDescription').value;

	// Get note Id from modal 
	noteId = document.getElementById('changeNoteModal').getAttribute("noteId");
	categoryId = document.getElementById('changeNoteModal').getAttribute("categoryId");

	// Validate Data
	if(noteHeading == "" || noteDescription == "") {
		alert("Please fill form before submitting.");
		return;
	}
	else {
		pushChangeNote(categoryId, noteId, noteHeading, noteDescription);
	}
}


function showStatus(statusCode) {


	// Alert Text based on status code
	if(statusCode == 0) {
		var alertText = "Success!! Data updated successfully.";
	}
	else if(statusCode == 2) {
		var alertText = "You have successfully logged In.";
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
	$(".category-sidebar-btn").removeClass("selected-category");
	$("#"+categoryId).addClass("selected-category");
}


// jQuery Code for Edit and Delete Categoty button actions
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
});
function hideLoaderDiv() {
	$("#loaderDiv").hide();
};


/* Code for data toggle between general and user. */

// Global boolean variable to store type(general/user) of data to show. "user_data = false" means 
// it will show general data.
var user_data;	

document.getElementById('general-data-btn').addEventListener('click', handleGeneralData);
document.getElementById('user-data-btn').addEventListener('click', handleUserData);


function handleGeneralData() {

	// Return if general data is already loaded
	if(user_data == false) 
		return;
	user_data = false;

	// Change CSS
	document.getElementById('general-data-btn').style.backgroundColor = '#03396c';
	document.getElementById('user-data-btn').style.backgroundColor = 'transparent';

	// Load General Data
	pullCategories(user_data);

	return;
}


function handleUserData() {

	// Return if user data is already loaded
	if(user_data == true) 
		return;

	// Check user is signed in or not
	user = firebase.auth().currentUser;
	if(user) {
		// User is signed in

		user_data = true;

		// Change CSS
		document.getElementById('user-data-btn').style.backgroundColor = '#03396c';
		document.getElementById('general-data-btn').style.backgroundColor = 'transparent';

		// Load user data
		pullCategories(user_data);
		return;
	}
	else {
		// User is not signed In

		// Tell user to sign In first.
		alert("Please sign In first.");
		return;
	}
}


// Hide/Show Sign In and Sign Up form
$(document).ready(function() {
	$('#signUpNav').click(signUpForm);	
	$('#signInNav').click(signInForm);
	$('#addSapNote').click(addSapNote);

	// Hide and show addSapNoteForm 	
	function addSapNote() {
		$('.main-div').hide();
		$('#addSapNoteForm').slideDown();
	};

	// Hide other content and show signInForm 
	function signInForm() {
		$('.main-div').hide();
		$('#signInForm').slideDown();
	}

	// Hide other content and show signUpForm 
	function signUpForm() {
		$('.main-div').hide();
		$('#signUpForm').slideDown();
	}
});


// Hide all content from main div to show div
function hideMainDivContent() {
	$('.main-div').hide();
	$('#cont').slideDown();
	return;
}

$(document).ready(function() {
	/* This function adds event on signIn and signUp buttons and observes behaviour 
	 of authentication. */

	document.getElementById('signInBtn').addEventListener('click', signIn);
	document.getElementById("signUpBtn").addEventListener('click', signUp);
	document.getElementById('signOutNav').addEventListener('click', signOut);
	document.getElementById('emailNotVerified').addEventListener('click', sendEmailVerfication);	

	// Authentication State Observer
	firebase.auth().onAuthStateChanged(function(user) {
		if(user) {
			// User logged In

			// Check if user is already stored in DB or not. (Check if user is signing in or signing up)
			userRef = firebase.database().ref('/user/'+user.uid+'/').once('value',(snapshot) => {
				if(snapshot.exists() == false) {
					// User is not stored in DB means user is signing Up.

					console.log("User was not stored in DB.");
					firebase.database().ref('/user/'+user.uid+'/').set({
						uid: user.uid,
						email: user.email
					});	
					return;
				}
				console.log("User is stored in DB");
				return;
			});


			$('#usernameNav').text(user.email);
			document.getElementById('userData').style.display = 'block';
			if( user.emailVerified == false) {
				console.log("Email not verified");
				document.getElementById('emailNotVerified').style.display = 'block';
				document.getElementById('emailVerified').style.display = "none";
			}
			else {
				document.getElementById('emailVerified').style.display = "block";
				document.getElementById('emailNotVerified').style.display = "none";
			}
			userLoggedIn();
			showStatus(2);
		}
		else {
			// User is logged Out
			console.log("You have successfully signed out.");
			document.getElementById('userData').style.display = 'none';
			userLoggedOut();
		}
	});
})


function userLoggedIn() {

	// Hide signIn and signUp button
	$('#signInNavItem').hide();
	$('#signUpNavItem').hide();

	// Show username and signOut Button
	$('#signOutNavItem').show();
	$('#usernameNavItem').show();
}

function userLoggedOut() {

	// Hide username and signOut button
	$('#signOutNavItem').hide();
	$('#usernameNavItem').hide();

	// Show signIn and signUp button
	$('#signInNavItem').show();
	$('#signUpNavItem').show();

}

// Sign Up
function signUp() {
	/* This function is used to sign Up user to firebase database. */

	// Get Values
	signUpUsername = document.getElementById('signUpUsername').value;
	signUpEmail = document.getElementById('signUpEmail').value;
	signUpPassword = document.getElementById('signUpPassword').value;

	// Sign Up using Firebase
	firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword).then(function(){
		// Successfully signed up.
		console.log("User has successfully signed up.");
	}).catch(function(error) {
		// Error Handling
		console.log("Something went wrong!! "+error);
	});
}


function sendEmailVerfication() {
	/* This function sends email verification to user. */

	firebase.auth().currentUser.sendEmailVerification().then(function() {
		// Email sent successfully.
		alert("Check you Email and verify.")
	}).catch(function(error) {
		// Error Handling
		alert("Something went wrong !! Please try after sometime.")
	});
}


// Sign In
function signIn() {
	/* This function is used to sign In user to firebase database. */

	// Get Values
	signInEmail = document.getElementById('signInEmail').value;
	signInPassword = document.getElementById('signInPassword').value;

	// Sign In Using Firebase
	firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword).catch(function(error) {
		//Error Handling
		console.log("Something went wrong!! "+error);
	});
}


function signOut() {
	// Sign Out user from firebase 

	firebase.auth().signOut();
}