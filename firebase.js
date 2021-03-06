// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDQW3d-chWI5MbTAqNN2LcJ91gxKzo1p5A",
	authDomain: "myproject2020-c8d32.firebaseapp.com",
	databaseURL: "https://myproject2020-c8d32.firebaseio.com",
	projectId: "myproject2020-c8d32",
	storageBucket: "myproject2020-c8d32.appspot.com",
	messagingSenderId: "156968638460",
	appId: "1:156968638460:web:368e691fd0eedc98370479",
	measurementId: "G-2SM2YZK7WF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Global variables
var database  = firebase.database(),
	allCategories = [], allNotes='';


// This function is currently not in use.
function pullCategories(data_id) {
	/* This function retrieves categories of SAP Notes from Firebase Database. */

	var pullCategoryRef;


	if(data_id == false) {
		// Pull General data 

		console.log("Pulling general category notes.");
		pullCategoryRef = database.ref('sap_notes/general_data/categories/');
	}
	else if(data_id == true) {
		// User data

		console.log("Pulling user category notes.");
		pullCategoryRef = database.ref('sap_notes/user_data/'+user.uid+'/categories/');
	}

	pullCategoryRef.once('value',function(snapshot) {

		if(snapshot.exists() == false) {
			console.log('No categories exist in firebase DB.');
			message('No category exist in Database. Please add category.');
			return;
		}

		// Clear all categories stored previously
		allCategories = [];

		snapshot.forEach(function(category) {
			var categoryKey = category.key;
			var categoryValue = category.val();

			// Storing category in global allCategories[] array for future use.
			var category = {
				id: categoryKey,
				name: categoryValue['data']['name'],
				description: categoryValue['data']['description']
			};
			allCategories.push(category);
		});

		// Add category to the side navigation
		addCategorySideBar();		/* Definition In: changeDOM.js */


		//           ***** Add <options>(all categories) in <select> element. *****

		// Clear previously stored (<option>)categories in <select> element
		selectElement = document.getElementById('noteCategory');
		selectElement.innerHTML = '';

		// Create <option> element for NULL value
		var opt = document.createElement('option');
		opt.innerHTML = ' -- Select -- ';
		opt.setAttribute('value','');
		selectElement.innerHTML = opt.outerHTML;

		var allOptElements = '';
		allCategories.forEach(function(category, index){

			// Create <option> element
			var opt = document.createElement("option");
			opt.innerHTML = category["name"];
			opt.setAttribute("value",category["id"]);

			allOptElements += opt.outerHTML;
		});
		selectElement.innerHTML += allOptElements;
	});
}


function pushCategory(categoryName, categoryDescription) {
	/* This function adds category of SAP Notes to Firebase Database. */

	var categoryData, pushCategoryRef;

	if( user_data == false) {
		// Push to general data

		pushCategoryRef = database.ref('sap_notes/general_data/categories/');
		categoryData = {
			data: {
				description: categoryDescription,
				name: categoryName
			},
			meta_data: {
				author: user.email,
			}
		}
	}
	else if(user_data == true) {
		// Push to user data

		pushCategoryRef = database.ref('sap_notes/user_data/'+user.uid+'/categories/');
		categoryData = {
			data: {
				description: categoryDescription,
				name: categoryName
			}
		}
	}
	pushCategoryRef.push(categoryData,function(error) {
		if(error) {
			console.log('Add category Error: '+error);
			showStatus(1, 'Error while pushing category. '+error);
		}
		else {
			console.log("Data updated successfully.");
			showStatus(0, 'Category has been pushed on cloud successfully.');		// Display status to user via alert
		}
	});

	return;
}


function saveEditCategory() {
	/* This function pushes change categoryName and categoryId to firebase database. */

	// Get changed category name and categoryId from global variable
	var categoryName = document.getElementById('categoryName_edit').value;
	if(user_data == false) {

	}

	// Validation
	if(!isSignedIn()) {
		alert('Please Sign In first.');
		return;
	}

	var updates = {};

	if(user_data == false) {
		// Update category of general data

		categoryId = selected_general_category;

		// Validation
		if(typeof categoryId == 'undefined' || typeof categoryName == 'undefined' || 
			categoryId == '' || categoryName == '')
			return;

		updates['sap_notes/general_data/categories/'+categoryId+'/data/name'] = categoryName;
	}
	else if(user_data == true) {
		// Update category of user data

		categoryId = selected_user_category;

		// Validation
		if(typeof categoryId == 'undefined' || typeof categoryName == 'undefined' || 
			categoryId == '' || categoryName == '')
			return;

		updates['sap_notes/user_data/'+user.uid+'/categories/'+categoryId+'/data/name'] = categoryName;	
	}

	database.ref().update(updates,function(error) {
		if(error) {
			console.log("Category updation failed.  "+error);
			showStatus(1, 'Failed.'+error);
			return;
		}
		else {
			console.log("Category updated successfully.")
			showStatus(0, 'Category Updated Successfully');
		}
	});
}


// Under development
function deleteCategory(categoryId) {
	/* This function will remove category of categoryId and all notes under same category */

	if(categoryId == '') {
		return;
	}

	if(user_data == false) {
		// Change in general data

		// Delete all notes of category categoryId
		// for(i = 0; i < deleteNotes.length; i++) {
		// 	noteId = deleteNotes[i];
		// 	database.ref('sap_notes/general_data/notes/'+noteId).remove();
		// }

		// Delete category
		console.log("categoryId: "+categoryId);
		console.log("User Uid: "+user.uid);
		database.ref('sap_notes/general_data/categories/'+categoryId).remove().then(function() {
			showStatus(0, "Category has been deleted successfully.");
		}).catch(function(error) {
			showStatus(2, "Category hasn't been removed. "+error);
		});
		
	}
	else if(user_data == true) {
		// Change in user data 

		// Delete all notes of category categoryId
		// for(i = 0; i < deleteNotes.length; i++) {
		// 	noteId = deleteNotes[i];
		// 	database.ref('sap_notes/user_data/'+user.uid+'/notes/'+noteId).remove();
		// }
		// database.ref('sap_notes/user_data/'+user.uid+'/notes/'+categoryId).remove();

		// Delete category
		database.ref('sap_notes/user_data/'+user.uid+'/categories/'+categoryId).remove().then(function() {
			showStatus(0, "Category has been deleted successfully.");
		}).catch(function(error) {
			showStatus(2, "Category hasn't been removed. "+error);
		});
	}
}


/*                       **************************** Listners on General Category **************************** */


categoryRef = database.ref('sap_notes/general_data/categories/');

// child_added listner on 'sap_notes/general_data/categories'
categoryRef.on('child_added', (snap) => {
	var categoryId  = snap.key, 
		categoryName = snap.val().data.name,
		sideCategoryDiv, categoryBtn, generalNotesDiv,
		categoryDiv, categorySelectBtn, option;

	// Add category button to the side navigation
	categoryBtn = document.createElement('button');
	categoryBtn.id = categoryId+'_btn';
	categoryBtn.setAttribute('class', 'btn btn-sm btn-outline-primary category-sidebar-btn');
	categoryBtn.setAttribute('category-id', categoryId);
	categoryBtn.textContent = categoryName;

	sideCategoryDiv = document.getElementById('categorySideDiv');
	sideCategoryDiv.appendChild(categoryBtn);

	// Make General Category Div in the Main Div
	categoryDiv = document.createElement('div');
	categoryDiv.id = categoryId + '_div';
	categoryDiv.setAttribute('class', 'category-div');

	generalNotesDiv = document.getElementById('general-notes-div');
	generalNotesDiv.appendChild(categoryDiv);

	// Add category to the <option>
	option = document.createElement('option');
	option.setAttribute('value', categoryId);
	option.textContent = categoryName;

	categorySelectBtn = document.getElementById('gn-category-select-btn');
	categorySelectBtn.appendChild(option);
});


// child_changed listner on 'sap_notes/general_data/categories'
categoryRef.on('child_changed', (snap) => {

	// Get values
	var categoryId  = snap.key, 
		categoryName = snap.val().data.name;

	                      // Update values in DOM
	// change in category btn
	categoryBtn = document.getElementById(categoryId+'_btn');
	categoryBtn.textContent = categoryName;

	// Change in option value
	option = document.querySelector('option[value="'+categoryId+'"]');
	option.textContent = categoryName;
});


// child_removed listner on 'sap_notes/general_data/categories'
categoryRef.on('child_removed', (snap) => {
	var categoryId = snap.key;

	// Remove Category Btn
	document.getElementById(categoryId+'_btn').remove();

	// Remove Option Element
	document.querySelector('option[value="'+categoryId+'"]').remove();

	// Remove General Category Div in the Main Div 
	document.getElementById(categoryId+'_div').remove();
});	


// Listners on auth Change
firebase.auth().onAuthStateChanged(function(user) {
	if(user) {

		var usrCategoryRef = database.ref('sap_notes/user_data/'+user.uid+'/categories'),
			usrNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes');

		// Clear #usrCategorySideDiv , #usr-category-select-btn , #user-notes-div 

		// Clear usrCategorySideDiv because if a user logs out and other user logs in then 2nd user's categories
		// will also be added with the previous categories. But this will also remove Add Category button
		document.getElementById('usrCategorySideDiv').innerHTML = '';
		document.getElementById('usr-category-select-btn').innerHTML = '';
		document.getElementById('user-notes-div').innerHTML = '';

		// Create and append addCategory btn
		// addCategoryBtn = document.createElement('button');
		// addCategoryBtn.setAttribute('class','btn btn-sm btn-primary add-category-btn');
		// addCategoryBtn.setAttribute('data-toggle','modal');
		// addCategoryBtn.setAttribute('data-target','#categoryModal');
		// addCategoryBtn.textContent = 'Add Category +';
		// document.getElementById('usrCategorySideDiv').appendChild(addCategoryBtn);


		/*                       **************************** Listners on User Category **************************** */

		
		// child_added listner on 'sap_notes/user_data/<user_id>/categories'
		usrCategoryRef.on('child_added', (snap) => {
			
			var categoryId = snap.key,
				categoryName = snap.val().data.name,
				sideCategoryDiv, categoryBtn, generalNotesDiv,
				categoryDiv, categorySelectBtn, option;
			
			// Add category to the side navigation
			categoryBtn = document.createElement('button');
			categoryBtn.id = categoryId+'_btn';
			categoryBtn.setAttribute('class', 'btn btn-sm btn-outline-primary category-sidebar-btn u-cat');
			categoryBtn.setAttribute('category-id', categoryId);
			categoryBtn.textContent = categoryName;

			sideCategoryDiv = document.getElementById('usrCategorySideDiv');
			sideCategoryDiv.appendChild(categoryBtn);

			// Make General Category Div in the Main Div
			categoryDiv = document.createElement('div');
			categoryDiv.id = categoryId+'_div';
			categoryDiv.setAttribute('class', 'u-category-div');

			generalNotesDiv = document.getElementById('user-notes-div');
			generalNotesDiv.appendChild(categoryDiv);

			// Add category to the <option>
			option = document.createElement('option');
			option.setAttribute('value', categoryId);
			option.textContent = categoryName;

			categorySelectBtn = document.getElementById('usr-category-select-btn');
			categorySelectBtn.appendChild(option);
		});


		// child_changed listner on 'sap_notes/user_data/<user_id>/categories'
		usrCategoryRef.on('child_changed', (snap) => {

			var categoryId = snap.key,
				categoryName = snap.val().data.name;

			// Change in category btn
			document.getElementById(categoryId+'_btn').textContent = categoryName;

			// Change in option value
			document.querySelector('option[value="'+categoryId+'"]').textContent = categoryName;
		});


		// child_removed listner on 'sap_notes/user_data/<user_id>/categories'
		usrCategoryRef.on('child_removed', (snap) => {
			
			var categoryId = snap.key;

			// Remove Category Btn
			document.getElementById(categoryId+'_btn').remove();

			// Remove Option Element
			document.querySelector('option[value="'+categoryId+'"]').remove();

			// Remove General Category Div in the Main Div 
			document.getElementById(categoryId+'_div').remove();
		});


		/*                       **************************** Listners on User Notes **************************** */


		// child_added listner on 'sap_notes/user_data/<user_id>/notes'
		usrNoteRef.on('child_added', (snap) => {

			var noteId = snap.key,
				categoryId = snap.val().category_id,
				noteData = snap.val();
			
			noteDiv = document.createElement('div');
			noteDiv.id = noteId;
			noteDiv.setAttribute('class', 'mt-3')
			noteDiv.setAttribute('category_id', categoryId);

			noteDiv.innerHTML = `
				<button class="btn btn-block note-heading-btn" id="${noteId}_heading" onclick="toggleNoteContent('${noteId}')">${noteData.data.heading}&nbsp;&nbsp; <i class="fas fa-angle-double-down"></i> </button>
				<div class="note-content" id="${noteId}_div">
					<textarea readonly class="note-content" id="${noteId}_content" style="height: 150px;">${noteData.data.description}</textarea>
					<div class="border-up">
						<button class="btn btn-sm btn-outline-info copy-note" onclick="copyToClipboard('${noteId}_content')"> <i class="far fa-copy"></i> </button>
						<button class="btn btn-sm btn-outline-success edit-note" id='${noteId}_edit' onclick="editNote('${noteId}')"> <i class="far fa-edit"></i> </button>
						<button class="btn btn-sm btn-outline-danger delete-note" onclick="confirmDeleteNote('${noteId}')"> <i class="far fa-trash-alt"></i> </button>
					</div>
				</div>
			`;
			document.getElementById(categoryId + '_div').appendChild(noteDiv);
		});

		// child_changed listner on 'sap_notes/user_data/<user_id>/notes'
		usrNoteRef.on('child_changed', (snap) => {

			var noteData = snap.val(),
			noteId = snap.key;

			// Change values in DOM
			document.getElementById(noteId+'_heading').textContent = noteData.data.heading;
			document.getElementById(noteId+'_content').textContent = noteData.data.description;
		});

		// child_removed listner on 'sap_notes/user_data/<user_id>/notes'
		usrNoteRef.on('child_removed', (snap) => {
			var noteId = snap.key;

			// Remove note Div
			document.getElementById(noteId).remove();
		});
	}
});


function pushNotesOfCategory(categoryId, noteHeading, noteDescription) {
	/* 
		This function pushes new note of choosen category to Firebase Database.
	*/

	var noteData, pushNoteRef;
	var currentTime = Date.now();

	if(user_data == false) {
		// Push to general data

		pushNoteRef = database.ref('sap_notes/general_data/notes/');
		noteData = {
			data: {
				heading: noteHeading,
				description: noteDescription,
				additionalNotes: ""
			},
			meta_data: {
				author: user.email,
				publish_date: currentTime,
				last_modified: currentTime,
				last_modified_by: user.email	
			}, 
			category_id: categoryId
		}
	}
	else if(user_data == true) {
		// Push to user data

		pushNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/');
		noteData = {
			data: {
				heading: noteHeading,
				description: noteDescription,
				additionalNotes: ""
			},
			meta_data: {
				publish_date: currentTime,
				last_modified: currentTime
			}, 
			category_id: categoryId
		}
	}
	/* change this push with set method like push().set({}). This way,
		we'll be able to use promise returned by set().
	*/
	pushKeyRef = pushNoteRef.push(noteData,function(error) {
		if(error) {
			console.log("Push Notes Error: "+error);
			showStatus(1, 'Error while pushing note. '+error);	
		}
		else {
			console.log("Note pushed successfully.");
			document.getElementById('cancelNote').click();
			showStatus(0, 'Note has been pushed on cloud successfully.');
		}
	});
	newNoteKey = pushKeyRef.key;
}


function pushChangeNote(noteId, noteHeading, noteDescription) {
	/* This function updates(pushes) data in the firebase database. */

	var notePath, updates = {}, 
		last_modified_user = user.email, last_modified_at = Date.now(), 
		noteData = {
			additionalNotes: "",
			description: noteDescription,
			heading: noteHeading,
		};

	if(user_data == false) {
		// Change general data

		notePath = 'sap_notes/general_data/notes/'+noteId;
		console.log(notePath);

		updates[notePath+'/data/description'] = noteDescription;
		updates[notePath+'/data/heading'] = noteHeading;
		updates[notePath+'/meta_data/last_modified_by'] = last_modified_user;
		updates[notePath+'/meta_data/last_modified'] = last_modified_at;

		// Push update in firebase database
		database.ref().update(updates, function(error){
			if(error) {
				console.log("Something went wrong!!"+error);
				showStatus(1, 'Changes were not updated! '+error);
			}
			else {
				console.log("Data updated successfully.");
				showStatus(0, 'Note has been updated successfully! ');
				document.getElementById('cancelChangeNote').click(); /* Close modal */
			}
		});
	}
	else {
		// Change user data

		notePath = 'sap_notes/user_data/'+user.uid+'/notes/'+noteId;

		// Write new note data
		updates[notePath+'/data/description'] = noteDescription;
		updates[notePath+'/data/heading'] = noteHeading;
		updates[notePath+'/meta_data/last_modified'] = last_modified_at;

		// Push update in firebase database
		database.ref().update(updates, function(error){
			if(error) {
				console.log('Change Note Error: '+error);
				showStatus(1, 'Something went wrong! '+error);
			}
			else {
				console.log("Data updated successfully.");
				showStatus(0, 'Note has been updated successfully ');
				document.getElementById('cancelChangeNote').click(); /* Close modal */
			}

		});
	}
}


function removeNote(noteId) {
	/* This function removes note(noteId) of categoryId from firebase database. */

	if(user_data == false) {
		// Delete general data

		delNoteRef = database.ref('sap_notes/general_data/notes/'+noteId);
	}
	else if(user_data == true) {
		// Delete user data

		delNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/'+noteId);
	}
	delNoteRef.remove().then(function() {
		showStatus(0,"Note has been successfully removed.");
	}).catch(function(error) {
		showStatus(2, "Note hasn't been removed. "+error);
	});
}


/*                       **************************** Listners on General Notes **************************** */


noteRef = database.ref('sap_notes/general_data/notes');

// Child_added listner on General Notes
noteRef.on('child_added', (snap) => {

	var noteDiv, categoryId = snap.val().category_id,
		noteId = snap.key,
		noteData = snap.val();

	author = noteData.meta_data.author.split('@')[0];

	noteDiv = document.createElement('div');
	noteDiv.id = noteId;
	noteDiv.setAttribute('class', 'mt-3')
	noteDiv.setAttribute('category_id', categoryId);

	noteDiv.innerHTML = `
		<button class="btn btn-block note-heading-btn" id="${noteId}_heading" onclick="toggleNoteContent('${noteId}')">${noteData.data.heading}&nbsp;&nbsp; <i class="fas fa-angle-double-up arrow"></i> </button>
		<div class="note-content" id="${noteId}_div">
			<textarea readonly class="note-content" id="${noteId}_content">${noteData.data.description}</textarea>
			<div class="border-up">
				<button class="btn btn-sm btn-outline-info copy-note" onclick="copyToClipboard('${noteId}_content')"> <i class="far fa-copy" data-toggle="tooltip" data-placement="bottom" title="Copy"></i> </button>
				<button class="btn btn-sm btn-outline-success edit-note" title="Edit" id='${noteId}_edit' onclick="editNote('${noteId}')"> <i class="far fa-edit"></i> </button>
				<button class="btn btn-sm btn-outline-danger delete-note" title="Delete" onclick="confirmDeleteNote('${noteId}')"> <i class="far fa-trash-alt"></i> </button>
				<a class="author-note" title="Author"><i class="fas fa-user"></i>&nbsp;${author}</a>
			</div>
		</div>
	`
	document.getElementById(categoryId+'_div').appendChild(noteDiv);

	// Adjust the height of textarea. This height can only be adjusted after element is added on the page.
	textarea = document.getElementById(noteId+'_content');
	scrollH = textarea.scrollHeight;
	textarea.style.height = scrollH+5+'px';

	// Hide spinner
	document.querySelector('.spinner-grow').classList.add('hide');
});

// Child_changed listner on General Notes
noteRef.on('child_changed', (snap) => {

	var noteData = snap.val(),
		noteId = snap.key;

	// Change values in DOM
	document.getElementById(noteId+'_heading').textContent = noteData.data.heading;
	document.getElementById(noteId+'_content').textContent = noteData.data.description;
});

// Child_removed listner on General Notes
noteRef.on('child_removed', (snap) => {
	var noteId = snap.key;

	// Remove note Div
	document.getElementById(noteId).remove();
});


// No use of this function now
function pullNotesOfCategory(categoryId) {
	/* This function pulls all notes of category categoryId */

	hideMainDivContent();
	changeCategoryBtnStyle(categoryId);

	if(user_data == false) {
		// Pull General Data

		var pullNoteRef = database.ref('sap_notes/general_data/notes/'+categoryId+'/category_notes/');
	} 
	else if(user_data == true) {
		// Pull User data

		var pullNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/');
	}
	pullNoteRef.once('value',function(snapshot){
		allNotes = snapshot.val();
		if(allNotes == null) {

			// Clear previous data of main div
			document.getElementById('cont').innerHTML = "";

			message('No data exist in Database. Please add note of this category.');
			return;
		}
		else {
			showNotes(categoryId, allNotes);		// Definition In: changeDOM.js
		}
	});
	addEditDelete(categoryId);
	return;
}

// No use of this function now
function updateUpvote(categoryId, noteId, elementId) {
	var updates = {}, totalUpvotes = null, metaNotePath, 
		metaNoteRef, userUpvotedNote, userUpvoteNoteRef;

	if(user_data == false) {
		// Get total upvotes from General Note

		metaNotePath = 'sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/'+noteId+'/meta';
		metaNoteRef = database.ref(metaNotePath);
	}
	else if(user_data == true) {
		// Get total upvotes from User Note

		metaNotePath = 'sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/'+noteId+'/meta';
		metaNoteRef = database.ref(metaNotePath);
	}

	metaNoteRef.once('value', function(snapshot) {
		totalUpvotes = snapshot.val().likes;
		console.log('Total Upvotes: '+totalUpvotes);

		// Get boolean value whether user has already upvoted the note or not.
		userUpvoteNoteRef = database.ref('sap_notes/upvotes/'+user.uid+'/'+noteId+'/upvoted');
		userUpvoteNoteRef.once('value', function(snapshot) {
			userUpvotedNote = snapshot.val();
			console.log("User Upvoted Note: "+userUpvotedNote);

			// User has never upvoted this note.
			if(userUpvotedNote == null) {
				updates[metaNotePath+'/likes'] = totalUpvotes + 1;
				updates['sap_notes/upvotes/'+user.uid+'/'+noteId+'/upvoted'] = true;
			}
			// User has already upvoted note. Now, he wants to remove upvote
			else if(userUpvotedNote == true) {
				updates[metaNotePath+'/likes'] = totalUpvotes - 1;
				updates['sap_notes/upvotes/'+user.uid+'/'+noteId+'/upvoted'] = false;
			}
			else if(userUpvotedNote == false) {  // User wants to upvote note
				updates[metaNotePath+'/likes'] = totalUpvotes + 1;
				updates['sap_notes/upvotes/'+user.uid+'/'+noteId+'/upvoted'] = true;
			}
			// Push Updates
			database.ref().update(updates, function(error) {
				if(error) {
					console.log("Updating upvote failed."+error);
					return;
				}
				console.log('Upvoted Successfully');
				// Changing CSS here will not work because the elements are getting generated 
				// again in 'on' listener in pullNoteOfCategory() function . 
			});
		});
	});

	// Listener for changes in Upvotes
	database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/'+noteId+'/meta/likes').on('value',function(snapshot) {
		totalLikes  = snapshot.val();
		document.querySelector('#upvoteNote'+elementId).textContent = totalLikes;
		// document.getElementById('upvoteNote'+elementId).textContent = totalLikes;
	});
}