/*
function showUpvote() {
	// Pull value of upvote of all notes for signed in user

	var elemId = 1;
	var noteId, noteUpvoted, upvoteBtn;
	
	user = firebase.auth().currentUser;
	if(user == null) 
		return;

	for(let key in allNotes) {
		console.log("ElemID: "+elemId);
		noteId = key;
		database.ref('sap_notes/upvotes/'+user.uid+'/'+noteId+'/upvoted').once('value', function(snapshot) {
			console.log("ElemId:"+elemId);
			// Get note value
			noteUpvoted = snapshot.val();

			// Update DOM
			upvoteBtn = document.getElementById('upvoteNote'+elemId);

			if(noteUpvoted == true) {
				upvoteBtn.classList.add('note-upvoted');
			}
			else if(false) {
				upvoteBtn.classList.remove('note-upvoted');
			}
			else if(noteUpvoted == null) {
				upvoteBtn.classList.remove('note-upvoted');
			}

			elemId += 1;
			semaphoreLock = false;
		});
		console.log("ElemID2: "+elemId);
	}
} 
*/


function editNote(noteId) {
	/* This function gets data from Notes div and fills in the form. */

	// Check if user is logged in 
	user = firebase.auth().currentUser;
	if(user) {

		// Get Note Data from Note Div
		categoryId = document.getElementById(noteId).getAttribute('category_id');	
		noteHeading = document.getElementById(noteId+'_heading').textContent;
		noteDescription = document.getElementById(noteId+'_content').textContent;

		// Open modal 
		// data-toggle="modal" data-target="#changeNoteModal"
		editBtn = document.getElementById(noteId+'_edit');
		editBtn.setAttribute('data-toggle','modal');
		editBtn.setAttribute('data-target', '#changeNoteModal');


		// Add noteId attribute to the modal(#changeNoteModal)
		changeNoteModal = document.getElementById('changeNoteModal');
		changeNoteModal.setAttribute('note-id',noteId);	
		changeNoteModal.setAttribute('category-id', categoryId);

		// Fill data in form
		document.getElementById('changeNoteHeading').value = noteHeading;
		document.getElementById('changeNoteDescription').value = noteDescription;		
	}
	else {
		// Remmove previously set attributes
		editBtn = document.getElementById(noteId+'_edit');
		editBtn.removeAttribute('data-toggle');
		editBtn.removeAttribute('data-target');

		alert("Please Sign In first.");
		return;
	}
}


function confirmDeleteNote(noteId) {
	
	// Check user is signed In or Not
	if(isSignedIn()) {
		// User is signed In

		if(confirm("Are you sure you want to delete this note ?")){
			removeNote(noteId);
			return;
		}
		return;
	}
	else {
		// User is not signed In

		alert("Please sign In first. ");
		return;
	}
}


function addEditDelete(categoryId) {
	/* This function adds categoryId to edit and delete button for editing and deleting choosen category. */

	editBtn = document.getElementById("editCategory");
	editBtn.setAttribute("categoryId",categoryId);

	deleteBtn = document.getElementById("deleteCategory");
	deleteBtn.setAttribute("categoryId",categoryId);
}


function insertCategoryText() {
	/* This function gets category text from category button and adds it to the  input category element */
	
	// Get category Id
	categoryId = document.getElementById("editCategory").getAttribute("categoryId");

	// Get category text from selected category button(with id "categoryId")
	const categoryText = document.getElementById(categoryId).innerHTML;

	// Put category name in the input element of #editInputDiv

	// Get Input element 
	inputCategoryElement = document.getElementById("inputCategoryElement");

	// Insert text in input category element
	inputCategoryElement.value = categoryText;

	// Add categoryId attribute with "categoryId" value to pass and change this category on submission.
	inputCategoryElement.setAttribute("categoryId",categoryId);
}


function editCategory() {
	/* This function gets changed input category text and categoryId and passes to changeCategory() function */

	// Get #inputCategoryElement text and category id
	categoryName = document.getElementById("inputCategoryElement").value;
	categoryId = document.getElementById("inputCategoryElement").getAttribute("categoryId");

	changeCategory(categoryName, categoryId);
}