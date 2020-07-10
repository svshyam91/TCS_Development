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

var database  = firebase.database();


// Global array for storing all categories
var allCategories = [];
function pullCategories(data_id) {
	/* This function retrieves categories of SAP Notes from Firebase Database. */


	if(data_id == false) {
		// Pull General data 

		console.log("Pulling general category notes.");
		pullCategoryRef = database.ref('sap_notes/activities/type/');
	}
	else if(data_id == true) {
		// User data

		console.log("Pulling user category notes.");
		pullCategoryRef = database.ref('sap_notes/user_data/'+user.uid+'/categories/');
	}

	pullCategoryRef.on('value',function(snapshot) {
		if(snapshot.exists() == false) {
			console.log("No categories exist in firebase DB.");
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
				name: categoryValue["meta"]["name"],
				description: categoryValue["description"]
			};
			allCategories.push(category);
		});

		// Add category to the side navigation
		addCategorySideBar();		/* Definition In: changeDOM.js */


		// Add <options>(all categories) in <select> element.
		// Clear previously stored (<option>)categories in <select> element
		selectElement = document.getElementById('noteCategory');
		selectElement.innerHTML = "";

		// Create <option> element for null value
		var optn = document.createElement("option");
		optn.innerHTML = " -- Select -- ";
		optn.setAttribute("value","");
		selectElement.innerHTML = optn.outerHTML;

		var allOptnElements = "";
		allCategories.forEach(function(category, index){

			// Create <option> element
			var optn = document.createElement("option");
			optn.innerHTML = category["name"];
			optn.setAttribute("value",category["id"]);

			allOptnElements += optn.outerHTML;
		});
		selectElement.innerHTML += allOptnElements;
	});
}


function pushCategory() {
	/* This function adds category of SAP Notes to Firebase Database. */


	// Get Values from category form
	var categoryName = document.getElementById('categoryName').value;
	var categoryDescription = document.getElementById('categoryDescription').value;

	// Validating form
	if(categoryName == "" || categoryDescription == "") {
		alert("Please fill form before submitting.");
		return;
	}

	if( user_data == false) {
		// Push to general data

		pushCategoryRef = database.ref('sap_notes/activities/type/');
	}
	else if(user_data == true) {
		// Push to user data

		pushCategoryRef = database.ref('sap_notes/user_data/'+user.uid+'/categories/');
	}
	pushCategoryRef.push({
		description: categoryDescription,
		meta: {
			name: categoryName
		}
	},function(error) {
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


function pushNotesOfCategory(noteCategoryValue, noteHeading, noteDescription) {
	/* 
		This function pushes SAP note of choosen category to Firebase Database.
		Called In: changeDOM.js -> submitForm()
	*/


	if(user_data == false) {
		// Push to general data

		pushNoteRef = database.ref('sap_notes/typeDetail/allActivityTypes/'+noteCategoryValue+'/activityNotes/');
	}
	else if(user_data == true) {
		// Push to user data

		pushNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/'+noteCategoryValue+'/category_notes/');
	}
	pushNoteRef.push({
		heading: noteHeading,
		description: noteDescription,
		additionalNotes: ""
	},function(error) {
		if(error) {
			console.log("Something went wrong!! "+error);
		}
		else {
			console.log("Note pushed successfully.");
			showStatus(0);
		}
	});

	return;
}


var allNotes = "";
function pullNotesOfCategory(categoryId) {
	/* This function full all notes of category having id as categoryId */

	hideMainDivContent();
	changeCategoryBtnStyle(categoryId);

	if(user_data == false) {
		// Pull General Data

		var pullNoteRef = database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/');
	} 
	else if(user_data == true) {
		// Pull User data

		var pullNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/');
	}
	pullNoteRef.on('value',function(snapshot){
		allNotes = snapshot.val();
		if(allNotes == null) {

			// Clear previous data if there is no new data
			// Bug: This below line of code is not executing properly with alert()
			document.getElementById('cont').innerHTML = "";

			alert("No data exist");
			return;
		}
		else 
			showNotes(categoryId, allNotes);		// Definition In: changeDOM.js
	});

	addEditDelete(categoryId);
	return;
}


function pushChangeNote(categoryId, noteId, noteHeading, noteDescription) {
	/* This function updates(pushes) data in the firebase database. */

	var noteData = {
		additionalNotes: "",
		description: noteDescription,
		heading: noteHeading,
		id: 1
	};

	if(user_data == false) {
		// Change general data

		// Generate a key for new note
		newNoteKey = database.ref().child('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/').push().key;

		// Write new note data
		var updates = {};
		updates['sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/'+newNoteKey] = noteData;

		// Push update in firebase database
		database.ref().update(updates, function(error){
			if(error)
				console.log("Something went wrong!!"+error);
			else
				console.log("Data updated successfully.");
				window.reload()
		});

		// Remove old data
		database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/'+noteId).remove();
	}
	else {
		// Change user data

		// Generate a key for new note
		newNoteKey = database.ref().child('sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/').push().key;

		// Write new note data
		var updates = {};
		updates['sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/'+newNoteKey] = noteData;

		// Push update in firebase database
		database.ref().update(updates, function(error){
			if(error)
				console.log("Something went wrong!!"+error);
			else
				console.log("Data updated successfully.");
				window.reload()
		});

		// Remove old data
		database.ref('sap_notes/user_data/'+user.uid+'/notes/'+categoryId+'/category_notes/'+noteId).remove();
	}

	showStatus(0);

	/* The reason why we first added and then removed data from the firebase database instead 
	of directly updating it is because if we push data with new key, we will get different advantages
	like sorting data. */
}


function removeNote(categoryId, noteId) {
	/* This function removed note(noteId) of categoryId from firebase database. */

	if(user_data == false) {
		// Delete general data

		delNoteRef = database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/'+noteId);
	}
	else if(user_data == true) {
		// Delete user data

		delNoteRef = database.ref('sap_notes/user_data/'+user.uid+'/notes/'+categoryId).child('/category_notes/'+noteId);
	}
	delNoteRef.remove();
}

// We have not changed below functions as per general/user 
function changeCategory(categoryName, categoryId) {
	/* This function pushes change categoryName and categoryId to firebase database. */

	var updates = {};
	updates['sap_notes/activities/type/'+categoryId+'/meta/name'] = categoryName;
	updates['sap_notes/typeDetail/allActivityTypes/'+categoryId+'/meta/name'] = categoryName;

	database.ref().update(updates);
	showStatus(0);
}


function deleteCategory(categoryId) {
	/* This function will remove category of categoryId and all notes under same category */

	// Delete all notes of category categoryId
	database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId).remove();

	// Delete category
	database.ref('sap_notes/activities/type/'+categoryId).remove();
}