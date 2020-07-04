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
function pullCategories() {
	/* This function retrieves categories of SAP Notes from Firebase Database. */


	data = database.ref('sap_notes/activities/type/').on('value',function(snapshot) {
		// make sure here that some values exist. Right code to verify that

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

		// Append option elements in the select dropdown menu of Notes form.
		allCategories.forEach(function(category, index){

			// Create <option> element
			var optn = document.createElement("option");
			optn.innerHTML = category["name"];
			optn.setAttribute("value",category["id"]);

			// Append <option> element to <select> element
			selectElement = document.getElementById('noteCategory');
			selectElement.appendChild(optn);
		})
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


	// Push category to firebase database
	categoryRef = database.ref('sap_notes/activities/type/').push({
		description: categoryDescription,
		meta: {
			id: 0,
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
	categoryKey = categoryRef.key;		// Currently no use.
}


function pushNotesOfCategory(noteCategoryValue, noteHeading, noteDescription) {
	/* 
		This function pushes SAP note of choosen category to Firebase Database.
		Called In: changeDOM.js -> submitForm()
	*/

	pushNoteRef = database.ref('sap_notes/typeDetail/allActivityTypes/'+noteCategoryValue+'/activityNotes/');
	pushNoteRef.push({
		id: 0,
		heading: noteHeading,
		description: noteDescription,
		additionalNotes: ""
	});
	pushNoteRef.on('child_added', function(data){
		console.log("A child node has been added.")
	});
}


var allNotes = "";
function pullNotesOfCategory(categoryId) {
	/* This function full all notes of category having id as categoryId */

	hideMainDivContent();

	changeCategoryBtnStyle(categoryId);
	database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/').on('value',function(snapshot){
		allNotes = snapshot.val();
		if(allNotes == null)
			alert("No data exist");
		else 
			showNotes(categoryId, allNotes);		// Definition In: changeDOM.js
	});

	addEditDelete(categoryId);
}


function pushChangeNote(categoryId, noteId, noteHeading, noteDescription) {
	/* This function updates(pushes) data in the firebase database. */

	var noteData = {
		additionalNotes: "",
		description: noteDescription,
		heading: noteHeading,
		id: 1
	};

	// Generate a key for new note
	var newNoteKey = database.ref().child('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/').push().key;

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

	showStatus(0);

	/* The reason why we first added and then removed data from the firebase database instead 
	of directly updating it is because if we push data with new key, we will get different advantages
	like sorting data. */
}


function removeNote(categoryId, noteId) {
	/* This function removed note(noteId) of categoryId from firebase database. */

	database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/activityNotes/'+noteId).remove();
	
}


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