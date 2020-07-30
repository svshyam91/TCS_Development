function addCategorySideBar() {
	/* This function adds categories in the Side Bar */
	/* Called In: firebase.js -> pullCategories() */

	sideBarDiv = document.getElementById('categorySideBar');
	
	
	// We are getting values from allCategories[] global array defined in firebase.js
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


function showNotes(categoryId, allNotes) {
	/* This function displays all notes of selected category. 
		Called In: firebase.js -> pullNotesOfCategory()
	*/

	var allNotesDivs = '', elementId = 1, heading, description, authorEmail, totalUpvotes;

	for(var key in allNotes) {

		heading = allNotes[key]['data']["heading"];
		description = allNotes[key]['data']["description"];
		authorEmail = allNotes[key]['meta_data']['author'].split("@")[0];
		totalUpvotes = allNotes[key]['meta_data']['likes'];

		/* Creating element <div> to display content */
		var div = document.createElement("div");
		div.setAttribute('class','pre-text');
		div.setAttribute('categoryId', categoryId);
		div.setAttribute('noteId', key);
		div.setAttribute('id','note'+elementId)
		// <i class="fas fa-angle-double-up"></i>
		div.innerHTML = `
						<button class="btn btn-block note-heading-btn" onclick="displayNoteContent('${elementId}')">${heading}&nbsp;&nbsp;<i class="fas fa-angle-double-down" id="udAngle${elementId}"></i></button>
						<div class="note-content" id="noteContent${elementId}" category-id="${categoryId}" note-id="${key}" style="display: none;">
							<textarea readonly class="block-content" id="${key}">${description}</textarea>
							<div class="border-up">
								<button class="btn btn-sm btn-outline-info copy-note" onclick="copyToClipboard('${key}')"><i class="far fa-copy"></i></button>
								<button class="btn btn-sm btn-outline-success edit-note" id="editNote${elementId}" category-id="${categoryId}" note-id="${key}" onclick="editNote(${elementId})"><i class="far fa-edit"></i></button>
								<button class="btn btn-sm btn-outline-danger delete-note" id="deleteNote${elementId}" category-id="${categoryId}" note-id="${key}" onclick="confirmDeleteNote('${categoryId}','${key}')"><i class="far fa-trash-alt"></i></button>
								<button class="btn btn-sm btn-outline-primary share-note"><i class="fas fa-share-alt"></i></button>
								<button class="btn btn-sm btn-outline-secondary author-note" title="Author"><i class="fas fa-at"></i>&nbsp;${authorEmail}</button>
								<button class="btn btn-sm btn-outline-danger like-note" id="upvoteNote${elementId}" data-id="${elementId}" onclick="upvoteNote(${elementId})"><i class="fas fa-arrow-up"></i>&nbsp;${totalUpvotes}</i></button>	
							</div>
						</div>
						`
		
		allNotesDivs += div.outerHTML;
		elementId += 1;

	}
	// Add all Div elements in the #cont id div
	document.getElementById('cont').innerHTML = allNotesDivs;
}

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
		// editBtn = document.getElementById('editNote'+elementId);
		// editBtn.removeAttribute('data-toggle');
		// editBtn.removeAttribute('data-target');

		alert("Please Sign In first.");
		return;
	}
}


function confirmDeleteNote(categoryId, noteId) {
	
	// Check user is signed In or Not
	user = firebase.auth().currentUser;
	if(user) {
		// User is signed In

		if(confirm("Are you sure you want to delete this note ?")){
			removeNote(categoryId, noteId);
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