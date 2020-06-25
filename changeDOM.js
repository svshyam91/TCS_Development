function addCategorySideBar() {
	/* This function adds categories in the Side Bar */
	/* Called In: firebase.js -> pullCategories() */

	sideBarDiv = document.getElementById('categorySideBar');
	

	// We are getting values from allCategories[] global array defined in pullCategories().
	var allCategoryButtons = "";
	allCategories.forEach(function(category, index){
		categoryBtn = document.createElement('button');
		categoryBtn.setAttribute('class','btn btn-sm btn-block btn-outline-primary');
		categoryBtn.setAttribute('id',category["id"]);
		categoryBtn.setAttribute('onclick',"pullNotesOfCategory('"+category["id"]+"')");
		categoryBtn.innerHTML = category["name"];

		allCategoryButtons += categoryBtn.outerHTML;
	});
	// Appends new categories to sideBarDiv. Later change this to replace the elements
	sideBarDiv.innerHTML=allCategoryButtons;
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
	}
	pushNotesOfCategory(noteCategoryValue, noteHeading, noteDescription);		/* File: firebase.js */
}


function showNotes(categoryId, allNotes) {
	/* This function displays all notes of choosen category. 
		Called In: firebase.js -> pullNotesOfCategory()
	*/

	var allNotesDivs = ""

	for(var key in allNotes) {

		var heading = allNotes[key]["heading"];
		var id = allNotes[key]["id"];
		var description = allNotes[key]["description"];

		/* Creating element <div> to display content */
		var div = document.createElement("div");
		div.setAttribute("class","pre-text");
		div.setAttribute("categoryId", categoryId);
		div.setAttribute("noteId", key);

		div.innerHTML = `
						<h4>${heading}</h4>
						<pre class="block-content" id="${key}">${description}</pre>
						<button class="btn btn-sm btn-outline-info copy-text" onclick="copyToClipboard('${key}')">Copy Text</button>
						<button class="btn btn-sm btn-outline-success edit-note" id="${key}" onclick="editNote('${categoryId}','${key}')" data-toggle="modal" data-target="#changeNoteModal">Edit</button>
						<button class="btn btn-sm btn-outline-danger delete-note" id="${key}" onclick="confirmDeleteNote('${categoryId}','${key}')">Delete</button>
						`
		
		allNotesDivs += div.outerHTML;

	}
	// Add all Div elements in the #cont id div
	document.getElementById('cont').innerHTML = allNotesDivs;
}


function editNote(categoryId, noteId) {
	/* This function gets data from allNotes global variable and fills in the form. */

	// Get Data
	console.log(allNotes)
	noteHeading = allNotes[noteId]["heading"];
	noteDescription = allNotes[noteId]["description"];

	// Add noteId attribute to the modal(#changeNoteModal)
	changeNoteModal = document.getElementById('changeNoteModal');
	changeNoteModal.setAttribute('noteId',noteId);	
	changeNoteModal.setAttribute('categoryId', categoryId);

	// Fill data in form
	document.getElementById('changeNoteHeading').value = noteHeading;
	document.getElementById('changeNoteDescription').value = noteDescription;
}


function validateChangeNote() {
	/* This function validates data filled in changeNote form and passes data to pushChangeNote()
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
	}
	else {
		pushChangeNote(categoryId, noteId, noteHeading, noteDescription);
	}
}


function confirmDeleteNote(categoryId, noteId) {
	if(confirm("Are you sure you want to delete this note ?")){
		removeNote(categoryId, noteId);
	}
}


function addEditDelete(categoryId) {
	/* This function add categoryId to edit and delete button for editing and deleting choosen category. */

	editBtn = document.getElementById("editCategory");
	editBtn.setAttribute("categoryId",categoryId);

	deleteBtn = document.getElementById("deleteCategory");
	deleteBtn.setAttribute("categoryId",categoryId);
}

