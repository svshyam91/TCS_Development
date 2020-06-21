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


// Global variables for storing values in firebase database
var noteCategoryValue = "";
var noteHeading = "";
var noteDescription = "";

function validateAddNoteForm() {
	/* This function gets and validate data from addNote form and passes
		data to addNotes() function to update it in firebase database. */

	// Get values
	var noteCategory = document.getElementById('noteCategory');
	noteCategoryValue = noteCategory.options[noteCategory.selectedIndex].value;
	noteHeading = document.getElementById('noteHeading').value;
	noteDescription = document.getElementById('noteDescription').value;

	// Validate data
	if (noteCategoryValue == "" || noteHeading == "" || noteDescription == "" ) {
		alert("Please fill form before submitting.");
	}
	pushNoteOfCategory();		/* File: firebase.js */
}


function showNotes(allNotes) {

	console.log(allNotes["activityNotes"][0]);
	var totalNotes = allNotes["activityNotes"].length;
	var allNotesDivs = ""

	for(var key in allNotes["activityNotes"]) {

		var heading = allNotes["activityNotes"][key]["heading"];
		var id = allNotes["activityNotes"][key]["id"];
		var description = allNotes["activityNotes"][key]["description"];

		/* Creating element <div> to display content */
		var div = document.createElement("div");
		div.setAttribute("class","pre-text");
		div.innerHTML = `
						<h4>${heading}</h4>
						<pre class="block-content" id="${id}">${description}</pre>
						<button class="btn btn-sm btn-outline-info copy-text" onclick="copyToClipboard(${id})">Copy Text</button>
						<button class="btn btn-sm btn-outline-success edit-note" id="${id}">Edit</button>
						<button class="btn btn-sm btn-outline-danger delete-note" id="${id}">Delete</button>
						`
		
		allNotesDivs += div.outerHTML;
		/* Add pre elements to the #cont id div. */
		// document.getElementById("cont").innerHTML += div.outerHTML;

		// console.log("key:"+key);
		// console.log("value:"+allNotes["activityNotes"])
	}
	// Add all Div elements in the #cont id div
	document.getElementById('cont').innerHTML = allNotesDivs;

}