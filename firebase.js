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
var database  = firebase.database();
var allCategories = [], allNotes='';


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
				author: user.email
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
			console.log("Something went wrong!!");
		}
		else {
			console.log("Data updated successfully.");
			showStatus(0);		// Display status to user via alert
		}
	});

	return;
}


// We'll change this later, we have to change UI for changing the category
function changeCategory(categoryName, categoryId) {
	/* This function pushes change categoryName and categoryId to firebase database. */

	var updates = {};

	if(user_data == false) {
		// Change in general data

		updates['sap_notes/general_data/categories/'+categoryId+'/data/name'] = categoryName;
	}
	else if(user_data == true) {
		// Change in user_data

		updates['sap_notes/user_data/'+user.uid+'/categories/'+categoryId+'/meta/name'] = categoryName;	
	}

	database.ref().update(updates,function(error) {
		if(error) {
			console.log("Category updation failed. "+error);
			return;
		}
		console.log("Category updated successfully.")
		showStatus(0);
	});
}

// We'll change this later, we have to change UI for deleting the category
function deleteCategory(categoryId) {
	/* This function will remove category of categoryId and all notes under same category */

	if(user_data == false) {
		// Change in general data

		// Delete all notes of category categoryId
		database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId).remove();

		// Delete category
		database.ref('sap_notes/activities/type/'+categoryId).remove();
	}
	else if(user_data == true) {
		// Change in user data 

		// Delete all notes of category categoryId
		database.ref('sap_notes/user_data/'+user.uid+'/notes/'+categoryId).remove();

		// Delete category
		database.ref('sap_notes/user_data/'+user.uid+'/categories/'+categoryId).remove();

		/* NOTE: Later, add code for catching errors. */
	}
}


// child_added listner on 'sap_notes/general_data/categories'
categoryRef = database.ref('sap_notes/general_data/categories/');
categoryRef.on('child_added', (snap) => {
	var categoryId  = snap.key, 
		categoryName = snap.val().data.name,
		sideCategoryDiv, categoryBtn, generalNotesDiv,
		categoryDiv, categorySelectBtn, option;

	// Add category to the side navigation
	categoryBtn = document.createElement('button');
	categoryBtn.id = categoryId+'_btn';
	categoryBtn.setAttribute('class', 'btn btn-sm btn-block btn-outline-primary category-sidebar-btn');
	categoryBtn.textContent = categoryName;

	sideCategoryDiv = document.getElementById('categorySideDiv');
	sideCategoryDiv.appendChild(categoryBtn);

	// Make General Category Div in the Main Div
	categoryDiv = document.createElement('div');
	categoryDiv.id = categoryId+'_div';
	categoryDiv.setAttribute('class', 'border category-div');

	generalNotesDiv = document.getElementById('general-notes-div');
	generalNotesDiv.appendChild(categoryDiv);

	// Add category to the <option>
	option = document.createElement('option');
	option.setAttribute('value', categoryId);
	option.textContent = categoryName;

	categorySelectBtn = document.getElementById('category-select-btn');
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

		pushNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/'+noteCategoryValue+'/category_notes/');
		noteData = {
			data: {
				heading: noteHeading,
				description: noteDescription,
				additionalNotes: ""
			},
			meta: {
				publish_date: currentTime,
				last_modified: currentTime
			}
		}
	}
	pushKeyRef = pushNoteRef.push(noteData,function(error) {
		if(error) {
			console.log("Something went wrong!! "+error);
		}
		else {
			console.log("Note pushed successfully.");
			showStatus(0);
		}
	});
	newNoteKey = pushKeyRef.key;

	// ++++ Add log only when note is pushed successfully
	// Add push data in log_changes
	// database.ref('sap_notes/log_changes/'+newNoteKey+'/').set({
	// 	category_id: noteCategoryValue,
	// 	last_modified: currentTime
	// });
}


// Child_added listner on notes
noteRef = database.ref('sap_notes/general_data/notes');
noteRef.on('child_added', (snap) => {

	var noteDiv, categoryId = snap.val().category_id,
		noteId = snap.key,
		noteData = snap.val();

	noteDiv = document.createElement('div');
	noteDiv.id = noteId;
	noteDiv.setAttribute('category_id', categoryId);

	noteDiv.innerHTML = `
		<button class="btn btn-block note-heading-btn" id="${noteId}_heading">${noteData.data.heading}&nbsp;&nbsp; <i class="fas fa-angle-double-down"></i> </button>
		<div class="note-content">
			<textarea readonly class="note-content" id="${noteId}_content">${noteData.data.description}</textarea>
			<div class="border-up">
				<button class="btn btn-sm btn-outline-info copy-note"> <i class="far fa-copy"></i> </button>
				<button class="btn btn-sm btn-outline-success edit-note" id='${noteId}_edit' onclick="editNote('${noteId}')"> <i class="far fa-edit"></i> </button>
				<button class="btn btn-sm btn-outline-danger delete-note"> <i class="far fa-trash-alt"></i> </button>
				<button class="btn btn-sm btn-outline-primary share-note"> <i class="fas fa-share-alt"></i> </button>
				<button class="btn btn-sm btn-outline-secondary author-note" title="Author"><i class="fas fa-at"></i>&nbsp;${noteData.meta_data.author}</button>
				<button class="btn btn-sm btn-outline-danger like-note"> <i class="fas fa-arrow-up"></i> &nbsp;</i></button>	
			</div>
		</div>
	`
	document.getElementById(categoryId+'_div').appendChild(noteDiv);
});


noteRef.on('child_changed', (snap) => {

	var noteData = snap.val(),
		noteId = snap.key;

	// Change values in DOM
	document.getElementById(noteId+'_heading').textContent = noteData.data.heading;
	document.getElementById(noteId+'_content').textContent = noteData.data.description;
});


noteRef.on('child_removed', (snap) => {
	var noteId = snap.key;

	// Remove note Div
	document.getElementById(noteId).remove();
});



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

		updates[notePath+'/data/description'] = noteDescription;
		updates[notePath+'/data/heading'] = noteHeading;
		updates[notePath+'/meta_data/last_modified_by'] = last_modified_user;
		updates[notePath+'/meta_data/last_modified'] = last_modified_at;

		// Push update in firebase database
		database.ref().update(updates, function(error){
			if(error)
				console.log("Something went wrong!!"+error);
			else
				console.log("Data updated successfully.");
		});
	}
	else {
		// Change user data

		notePath = 'sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/'+noteId;

		// Generate a key for new note
		// newNoteKey = database.ref().child('sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/').push().key;

		// Write new note data
		updates[notePath+'/data/description'] = noteDescription;
		updates[notePath+'/data/heading'] = noteHeading;
		updates[notePath+'/meta_data/last_modified'] = last_modified_at;
		// updates['sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/'+newNoteKey] = noteData;

		// Push update in firebase database
		database.ref().update(updates, function(error){
			if(error)
				console.log("Something went wrong!!"+error);
			else
				console.log("Data updated successfully.");
				window.reload()
		});
	}
}


function removeNote(categoryId, noteId) {
	/* This function removes note(noteId) of categoryId from firebase database. */

	if(user_data == false) {
		// Delete general data

		delNoteRef = database.ref('sap_notes/general_data/notes/'+categoryId+'/category_notes/'+noteId);

		// Remove log
		logRef = database.ref('sap_notes/log_changes/'+noteId);
		logRef.remove();
	}
	else if(user_data == true) {
		// Delete user data

		delNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/'+categoryId).child('/category_notes/'+noteId);
	}
	delNoteRef.remove();
}


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