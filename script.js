// Global Variables
var user_data = false,
	selected_general_category,
	selected_user_category;


// JS Listeners
document.querySelector('.user-toggle-btn').addEventListener('click', toggleUserData);
document.getElementById('signInSubmit').addEventListener('click', signIn);
document.getElementById('signUpSubmitBtn').addEventListener('click', signUp);
document.getElementById('signOutNav').addEventListener('click', signOut);
document.getElementById('emailNotVerified').addEventListener('click', sendEmailVerfication);	
document.getElementById('categorySideDiv').addEventListener('click', displayCategoryNotes);
document.getElementById('usrCategorySideDiv').addEventListener('click', u_displayCategoryNotes);
document.getElementById('editCategory').addEventListener('click', editCategory);
document.getElementById('editCategorySubmitBtn').addEventListener('click', saveEditCategory);
// document.getElementById('deleteCategory').addEventListener('click', deleteCategory);
// document.getElementById('editUserCategory').addEventListener('click', editUserCategory);
// document.getElementById('deleteUserCategory').addEventListener('click', deleteUserCategory);

function u_displayCategoryNotes(e) {
	if( e.target && e.target.nodeName == 'BUTTON') {
		categoryBtn = e.target;

		// Remove class 's-cat' from all category-sidebar-btns
		categorySideBtns = document.querySelectorAll('.u-cat');
		for(const categorySideBtn of categorySideBtns.values()) {
			categorySideBtn.classList.remove('s-cat') ;
		}

		// Add class 's-cat' to the selected category-sidebar-btns
		categoryBtn.classList.add('s-cat');

		// Hide all divs from the main content
		categoryDivs = document.querySelectorAll('.u-category-div');
		for(const categoryDiv of categoryDivs.values()) {
			categoryDiv.style.display = 'none';
		}

		// Show selected category div
		categoryId = categoryBtn.getAttribute('category-id');
		document.getElementById(categoryId + '_div').style.display = 'block';	

		// Change global variable 
		selected_user_category = categoryId;	
	}
}


function displayCategoryNotes(e) {

	if( e.target && e.target.nodeName == 'BUTTON') {
		categoryBtn = e.target;

		// Remove class 's-cat' from all category-sidebar-btns
		categorySideBtns = document.querySelectorAll('.category-sidebar-btn');
		for(const categorySideBtn of categorySideBtns.values()) {
			categorySideBtn.classList.remove('s-cat') ;
		}

		// Add class 's-cat' to the selected category-sidebar-btns
		categoryBtn.classList.add('s-cat');

		// Hide all divs from the main content
		categoryDivs = document.querySelectorAll('.category-div');
		for(const categoryDiv of categoryDivs.values()) {
			categoryDiv.style.display = 'none';
		}

		// Show selected category div
		categoryId = categoryBtn.getAttribute('category-id');
		document.getElementById(categoryId + '_div').style.display = 'block';

		// Change global variable 
		selected_general_category = categoryId;
	}
}


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


/*   ****************************  Validation of forms ***********************************   */


function validateAddCategoryForm() {
	/* This function gets and validates data from addCategory form and passes
		data to pushCategory() -> firebase.js to add in firebase database.	
	*/

	if(isSignedIn()) {
		// User is signed In

		// Get Values from category form
		var categoryName = document.getElementById('categoryName').value;
		var categoryDescription = document.getElementById('categoryDescription').value;

		// Validating form
		if(categoryName == "" || categoryDescription == "") {
			alert("Please fill form before submitting.");
			return;
		}

		pushCategory(categoryName, categoryDescription);
	}
	else {
		// User is not logged In

		alert("Please log in first");
		return;
	}
}


function validateAddNoteForm() {
	/* This function gets and validate data from addNote form and passes
		data to addNotes() function to update it in firebase database. 
	*/

	var categorySelectBtn, categoryOptnValue, 
		noteHeading, noteDescription;


	// Check user is logged In or not
	user = firebase.auth().currentUser;
	if(user) {
		// User is logged In

		// Get values
		if(user_data == true) 
			categorySelectBtn = document.getElementById('usr-category-select-btn');
		else
			categorySelectBtn = document.getElementById('gn-category-select-btn');
			
		categoryOptnValue = categorySelectBtn.options[categorySelectBtn.selectedIndex].value;
		noteHeading = document.getElementById('noteHeading').value;
		noteDescription = document.getElementById('noteDescription').value;

		// Validate data
		if (categoryOptnValue == "" || noteHeading == "" || noteDescription == "" ) {
			alert("Please fill form before submitting.");
			return;
		}
		pushNotesOfCategory(categoryOptnValue, noteHeading, noteDescription);		/* File: firebase.js */
		return;
	}
	else {
		// User is not logged In

		alert("Please log in first");
		return;
	}
}


function validateChangeNote() {
	/* 
		This function validates data filled in changeNote form and passes data to pushChangeNote()
		in firebase.js file.
	*/


	// Check user is signed in or not 
	user = firebase.auth().currentUser;
	if(user) {
		// User is signed In


		// Get Values of form fields
		noteHeading = document.getElementById('changeNoteHeading').value;
		noteDescription = document.getElementById('changeNoteDescription').value;

		// Get note Id from modal 
		noteId = document.getElementById('changeNoteModal').getAttribute("note-id");
		categoryId = document.getElementById('changeNoteModal').getAttribute("category-id");

		// Validate Data
		if(noteHeading == "" || noteDescription == "") {
			alert("Please fill form before submitting.");
			return;
		}
		else {
			pushChangeNote(noteId, noteHeading, noteDescription);
		}
		return;
	}
	else {
		// User is not Signed In

		alert("Please sign In first.");
		return;
	}
}

function editCategory() {
	var categoryId;

	// Get element using global variable 'selected_general_category'
	if(selected_general_category) {
		categoryId = selected_general_category;
		categoryBtn = document.getElementById(categoryId+'_btn');
		categoryText = categoryBtn.textContent;
		// Add code category description also

		// Adding categoryText to edit-modal text input 
		document.getElementById('categoryName_edit').value = categoryText;
	}	
}


function showStatus(errCode, errMssg) {

	statusDiv = document.getElementById('statusAlert');
	statusDiv.classList = '';

	// Alert Text based on status code
	if(errCode == 0) {

		statusDiv.className = 'alert alert-success alert-dismissible status-alert';
	}
	else if(errCode == 2) {

		statusDiv.className = 'alert alert-warning alert-dismissible status-alert';
	}
	else {

		statusDiv.className = 'alert alert-danger alert-dismissible status-alert';
	}
	statusDiv.textContent = errMssg;

	// Display alert box.
	statusDiv.style.display = "block";

	// Hide alert box after 5 seconds 
	setTimeout(function() {
		document.getElementById("statusAlert").style.display = "none";
	}, 5000);
}


function toggleNoteContent(noteId) {
	/* 
		This function hides/displays .note-content and changes the angle(arrow) of the button.
		Later, replace this code with jQuery code(using delegate).
	*/

	noteContentDiv = document.getElementById(noteId+'_div');
	noteContentDiv.classList.toggle('hide');

	arrow = document.querySelector('#'+noteId+'_heading i');
	if(arrow.classList.contains('fa-angle-double-down')) {
		arrow.classList.remove('fa-angle-double-down');
		arrow.classList.add('fa-angle-double-up');
	}
	else {
		arrow.classList.remove('fa-angle-double-up');
		arrow.classList.add('fa-angle-double-down');
	}

	// arrow = document.querySelector('#-MDQJIwH1HN1snFN8fqS_content .arrow');
}


// jQuery Code for Edit and Delete Categoty button actions
// Below jQuery code has no use currently
/* 
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

		// Remove bselected-catlur of backgroud
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

		// Remove bselected-catlur of background
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
*/


/* Code for data toggle between general and user. */

// Global boolean variable to store type(general/user) of data to show. "user_data = false" means 
// it will show general data.
function toggleUserData() {

	// Change toggle btn
	toggleBtn = document.querySelector('.toggle-btn');

	if(toggleBtn.classList.contains('fa-toggle-off')) {
		// User mode

		console.log("You are in user mode");
		user_data = true;

		// Hide gn-select-btn and display usr-select-btn
		document.getElementById('gn-category-select-btn').style.display = 'none';
		document.getElementById('usr-category-select-btn').style.display = 'block';

		toggleBtn.classList.remove('fa-toggle-off');
		toggleBtn.classList.add('fa-toggle-on');
	}
	else {
		// General mode

		console.log("You are in general mode");
		user_data = false;

		// Hide usr-category-select-btn and display gn-category-select-btn
		document.getElementById('usr-category-select-btn').style.display = 'none';
		document.getElementById('gn-category-select-btn').style.display = 'block';

		toggleBtn.classList.remove('fa-toggle-on');
		toggleBtn.classList.add('fa-toggle-off');
	}

	// Toggle user/general row
	document.querySelector('.user-row').classList.toggle('hide-row');
	document.querySelector('.general-row').classList.toggle('show-row');
	document.querySelector('.user-row').classList.toggle('show-row');
	document.querySelector('.general-row').classList.toggle('hide-row');
}


/* This function adds event on signIn and signUp buttons and observes behaviour 
	of authentication. */

// Authentication State Observer
firebase.auth().onAuthStateChanged(function(user) {
	if(user) {
		// User logged In

		// Check if user is already stored in DB or not. (Check if user is signing in or signing up)
		userRef = firebase.database().ref('/user/'+user.uid+'/').once('value',(snapshot) => {
			if(snapshot.exists() == false) {
				// User is not stored in DB means user is signing Up.

				console.log("User is not stored in DB.");
				firebase.database().ref('/user/'+user.uid+'/').set({
					uid: user.uid,
					email: user.email
				});	
				return;
			}
			console.log("User is stored in DB");
			return;
		});


		// Display email on navigation bar
		document.getElementById('usernameNav').textContent = user.email;
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

		// Hide SignIn and SignUp Button and show username and signOut button
		document.getElementById('signInBtn').style.display = 'none';
		document.getElementById('signUpBtn').style.display = 'none';
		document.getElementById('signOutBtn').style.display = 'block';
		document.getElementById('usernameBtn').style.display = 'block';
	}
	else {
		// User is logged Out
		console.log("You have successfully signed out.");
		showStatus(2,"You have successfully logged out.");
		document.getElementById('userData').style.display = 'none';

		// Show SignIn and SignUp Button and Hide username and signOut button
		document.getElementById('signInBtn').style.display = 'block';
		document.getElementById('signUpBtn').style.display = 'block';
		document.getElementById('signOutBtn').style.display = 'none';
		document.getElementById('usernameBtn').style.display = 'none';
	}
});


function signUp() {
	/* This function is used to sign Up user to firebase database. */

	var signUpUsername, signUpEmail, signUpPassword;

	// Get Values
	signUpUsername = document.getElementById('signUpUsername').value;
	signUpEmail = document.getElementById('signUpEmail').value;
	signUpPassword = document.getElementById('signUpPassword').value;

	// Sign Up using Firebase
	firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword).then(function(){
		// Successfully signed up.

		console.log("User has successfully signed up.");
		showStatus(0, "Successfully signed Up !! ");
		document.getElementById('cancelSignUp').click();	/* Close modal */
	}).catch(function(error) {
		// Error Handling

		console.log("Sign Up Error: "+error);
		showStatus(1, error);
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


function signIn() {
	/* This function is used to sign In user to firebase database. */

	// Get Values
	signInEmail = document.getElementById('signInEmail').value;
	signInPassword = document.getElementById('signInPassword').value;

	// Sign In Using Firebase
	firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword)
	.then(function() {

		console.log("User has successfully logged in");
		showStatus(0, "You have successfully logged in.");
		document.getElementById('cancelSignIn').click(); /* Cancel button only closes modal */
	})
	.catch(function(error) {
		//Error Handling

		console.log("Sign In Error: "+error);
		showStatus(1, "Something went wrong!! "+error);
	});
}


function signOut() {
	// Sign Out user from firebase 

	firebase.auth().signOut();
}


function message(mssg_text) {
	// This function creates a div and adds it to the main content div to display message

	var mssgDiv = document.createElement('div');
	mssgDiv.setAttribute('id', 'messageBox');
	mssgDiv.setAttribute('class', 'message-box border');
	mssgDiv.innerHTML = `
		<span style="font-size: 100px">&#128542;</span>
		<p>${mssg_text}</p>
	`;

	// Add mssgDiv to the main content div (cont)

	mainDiv = document.getElementById('cont');
	mainDiv.innerHTML = "";
	mainDiv.appendChild(mssgDiv);
}


function isSignedIn() {
	user = firebase.auth().currentUser;
	if(user) {
		// User is signed In
		return user;
	}
	return false;
}


// Like Post. The below function is currently in use.
function upvoteNote(elementId) {
	if(isSignedIn()) {
		noteDiv = document.getElementById('noteContent'+elementId);
		categoryId = noteDiv.getAttribute('category-id');
		noteId = noteDiv.getAttribute('note-id');
		updateUpvote(categoryId, noteId, elementId);
	}
}