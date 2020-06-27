function addCategorySideBar() {
	/* This function adds categories in the Side Bar */
	/* Called In: firebase.js -> pullCategories() */

	sideBarDiv = document.getElementById('categorySideBar');
	

	// We are getting values from allCategories[] global array defined in pullCategories().
	var allCategoryButtons = "";
	allCategories.forEach(function(category, index){
		categoryBtn = document.createElement('button');
		categoryBtn.setAttribute('class','btn btn-sm btn-block btn-outline-primary category-sidebar-btn');
		categoryBtn.setAttribute('id',category["id"]);
		categoryBtn.setAttribute('onclick',"pullNotesOfCategory('"+category["id"]+"')");
		categoryBtn.innerHTML = category["name"];

		allCategoryButtons += categoryBtn.outerHTML;
	});
	// Appends new categories to sideBarDiv. Later change this to replace the elements
	sideBarDiv.innerHTML=allCategoryButtons;

	// Hide loader Div since the elements are added to the DOM
	hideLoaderDiv();
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
	/* This function displays all notes of selected category. 
		Called In: firebase.js -> pullNotesOfCategory()
	*/

	var allNotesDivs = ""
	var elementId = 1;
	for(var key in allNotes) {

		var heading = allNotes[key]["heading"];
		var id = allNotes[key]["id"];
		var description = allNotes[key]["description"];

		/* Creating element <div> to display content */
		var div = document.createElement("div");
		div.setAttribute("class","pre-text");
		div.setAttribute("categoryId", categoryId);
		div.setAttribute("noteId", key);
		// <i class="fas fa-angle-double-up"></i>
		div.innerHTML = `
						<button class="btn btn-block note-heading-btn" onclick="displayNoteContent('${elementId}')">${heading}&nbsp;&nbsp;<i class="fas fa-angle-double-down" id="udAngle${elementId}"></i></button>
						<div class="note-content" id="noteContent${elementId}" style="display: none;">
						<pre class="block-content" id="${key}">${description}</pre>
						<button class="btn btn-sm btn-outline-info copy-note" onclick="copyToClipboard('${key}')">Copy Text</button>
						<button class="btn btn-sm btn-outline-success edit-note" id="${key}" onclick="editNote('${categoryId}','${key}')" data-toggle="modal" data-target="#changeNoteModal">Edit</button>
						<button class="btn btn-sm btn-outline-danger delete-note" id="${key}" onclick="confirmDeleteNote('${categoryId}','${key}')">Delete</button>
						</div>
						`
		
		allNotesDivs += div.outerHTML;
		elementId += 1;

	}
	// Add all Div elements in the #cont id div
	document.getElementById('cont').innerHTML = allNotesDivs;
}


function editNote(categoryId, noteId) {
	/* This function gets data from allNotes global variable and fills in the form. */

	// Get Data
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
	/* This function gets changed input category text and categoryId and passes to pushCategory() function */

	// Get #inputCategoryElement text and category id
	categoryName = document.getElementById("inputCategoryElement").value;
	categoryId = document.getElementById("inputCategoryElement").getAttribute("categoryId");

	changeCategory(categoryName, categoryId);
}