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

	var database = firebase.database();
	data = database.ref('sap_notes/activities/type/').once('value').then(function(snapshot) {
		// make sure here that some values exist. Right code to verify that

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



		/*
		totalActivityTypes = activityTypes.length;
		for(i = 0; i < totalActivityTypes; i++) {

			activityName = activityTypes[i]["meta"]["name"];
			activityId = activityTypes[i]["meta"]["id"];

			// Storing category in global allCategories array for future use.
			var category = {
				name: activityName,
				id: activityId
			};
			allCategories.push(category);

			// Create <option> element
			var optn = document.createElement("option");
			optn.innerHTML = activityName;
			optn.setAttribute("value",activityId);

			// Append <option> element to <select> element
			selectElement = document.getElementById('noteCategory');
			selectElement.appendChild(optn);
		}*/
		addCategorySideBar();		/* Definition In: changeDOM.js */
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
	}


	// Push category to firebase database
	categoryRef = database.ref('sap_notes/activities/type/').push({
		description: categoryDescription,
		meta: {
			id: 0,
			name: categoryName
		}
	});
	categoryKey = categoryRef.key;

	console.log("New Key:"+categoryKey);
	// Push same category key for all notes related to this category
	// database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryKey+'/').set({});

	// database.ref('sap_notes/activities/type/').once('value').then(function(snapshot){
	// 	var totalCategories = snapshot.numChildren();
	// 	database.ref('sap_notes/activities/type/'+totalCategories+'/').set({
	// 		description: categoryDescription,
	// 		meta: {
	// 			id: totalCategories+1,
	// 			name: categoryName
	// 		}
	// 	});
	// });
}


function pushNoteOfCategory() {
	/* 
		This function pushes SAP note of choosen category to Firebase Database.
		Called In: changeDOM.js -> submitForm()
	*/

	var database = firebase.database();

	pushNoteRef = database.ref('sap_notes/typeDetail/allActivityTypes/'+noteCategoryValue+'/activityNotes/').push({
		id: 0,
		heading: noteHeading,
		description: noteDescription,
		additionalNotes: ""
	});
	console.log(pushNoteRef);

	// Search choosen Category -> Add note in choosen category
	/*
	var search = database.ref('sap_notes/typeDetail/allActivityTypes/').once('value').then(function(snapshot){
		allActivityTypes = snapshot.val();
		var index;
		console.log("Note category Value:" + noteCategoryValue)
		for(index = 0; index < allActivityTypes.length; index++) {
			if(allActivityTypes[index]["meta"]["id"] == noteCategoryValue){
				console.log("This is true. Index:"+index);
				break;	
			}
		}
		// Add 'sap_notes/typeDetail/allActivityTypes/{i}/activityNotes/'
		newIndex =  allActivityTypes[index]["activityNotes"].length
		
		// Add data(note) in Choosen category
		database.ref('sap_notes/typeDetail/allActivityTypes/'+index+'/activityNotes/'+newIndex).set({
			id: newIndex+1,
			heading: noteHeading,
			description: noteDescription,
			additionalNotes:""				
		}, function(error) {
			if(error)
				alert("Something went wrong!!");
			else {
				alert("Data updated successfully.");
				location.reload();
			}
		});
	});
	*/
}


function pullNotesOfCategory(categoryId) {
	/* This function full all notes of category having id as categoryId */

	var database = firebase.database();

	database.ref('sap_notes/typeDetail/allActivityTypes/'+categoryId+'/').once('value').then(function(snapshot){
		allNotes = snapshot.val();
		if(allNotes == null)
			alert("No data exist");
		showNotes(allNotes);		// Definition In: changeDOM.js
	});
}