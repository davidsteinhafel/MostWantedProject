/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people) {

  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch (searchType) {
    case 'yes':
      let person = searchByName(people);
      mainMenu(person, people);
      break;
    case 'no':
      // TODO: search by traits
      let results = searchByTraits(people, ["gender", "dob", "height", "weight", "eyeColor", "occupation"]);
      if(results.length == 0 || results == undefined){
        alert("Could not find that individual.");
        app(people);
      }
      if(results.length == 1){
        mainMenu(results[0], people);
      }
      else{
        displayPeople(results);
        app(people);
      }
      break;
    default:
      alert("Invalid input. Please try again!");
      app(people); // restart app
      break;
  }
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  var displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch (displayOption) {
    case "info":
      displayPerson(person);
      // TODO: get person's info
      break;
    case "family":
      let family = getFamily(person, people);
      displayPeople(family);
      // TODO: get person's family
      break;
    case "descendants":
      // TODO: get person's descendants
      let descendants = searchForDescendants(person, people);
      displayPeople(descendants);
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

function searchByName(people) {
  var firstName = promptFor("What is the person's first name?", chars);
  var lastName = promptFor("What is the person's last name?", chars);

  let filteredPeople = people.filter(function (el) {
    if (el.firstName === firstName && el.lastName === lastName) {
      return el;
    }
  });
  // TODO: What to do with filteredPeople?
  return filteredPeople.shift();
}

function searchByTraits(people, options, traits = []) {
  var trait = promptFor(`Please enter what you would like to search for (${options.toString()}). \nType "start" to begin the searching process.`, chars2);

  if (trait === "start" || traits.length == 5) {

    let filteredPeople = [].concat(people);
    traits.forEach(trait => {
      let value = promptFor(`Please enter value for ${trait}.`, chars);
      if (trait == "height" || trait == "weight") {
        filteredPeople = filteredPeople.filter(x => x[trait] == parseInt(value));
      }
      else {
        filteredPeople = filteredPeople.filter(x => x[trait] == value);
      }
    });
    return filteredPeople;
  }
  else {
    traits.push(trait);
    options = options.filter(x => x != trait);
    return searchByTraits(people, options, traits);
  }
}


function getFamily(person, people) {
  let children = people.filter(x => x.parents.includes(person.id));
  children.forEach(x => x.Relation = "Child");

  let spouse = people.filter(x => x.currentSpouse == person.id);
  spouse.forEach(x => x.Relation = "Spouse");

  let parents = person.parents.map(parentId => people.find(x => x.id == parentId));
  parents.forEach(x => x.Relation = "Parent");

  let siblings = getSiblings(person.parents, people);
  siblings.forEach(x => x.Relation = "Sibling");

  let family = [].concat(children, spouse, parents, siblings);

  return [...(new Set(family))].filter(x => x.id != person.id);
}

var searchForDescendants = (person, people, descendants = [], loopCounter = 0) => {
  let children = people.filter(x => x.parents.includes(person.id));

  if (children.length > 0) {
    if (loopCounter > 0) {
      descendants.push(person);
    }

    children.map(x => searchForDescendants(x, people, descendants, ++loopCounter));
  }
  else {
    descendants.push(person);
  }
  return descendants;
}

var getPerson = (id, people) => people.find(x => x.id == id);
var getSiblings = (parents, people) => {
  var siblings = [];

  parents.map(parentId => {
    siblings = siblings.concat(people.filter(x => x.parents.includes(parentId)));
  });
  return siblings;
}

// alerts a list of people
function displayPeople(people) {
  alert(people.map(function (person) {
    if(person.Relation != undefined){
      return person.Relation + ": " + person.firstName + " " + person.lastName;
    }
    else{
      return person.firstName + " " + person.lastName;
    }
  }).join("\n"));
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  var personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";

  // TODO: finish getting the rest of the information to display
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "Age: " + getAge(person.dob) + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  alert(personInfo);
}

function findFamily(person, people) {
  var children = people.filter(p => p.parents.includes(person.id));
  var spouse = people.filter(p => p.currentSpouse == person.id);
  var familyInfo = "Children: " + children.firstName + "\n";
  familyInfo += "Current Spouse: " + spouse.firstName + "\n";
  familyInfo += "Parents: " + person.parents + "\n";
  alert(familyInfo);
}

function getAge(dob) {
  let today = new Date();
  let dobComponents = dob.split('/').map(x => parseInt(x));

  let age = today.getFullYear() - dobComponents[2];
  let month = today.getMonth() - dobComponents[1];
  let day = today.getDate() - dobComponents[0];

  return (month < 0 || (month == 0 && day < 0)) ? age - 1 : age;

}

// function that prompts and validates user input
function promptFor(question, callback) {
  do {
    var response = prompt(question).trim();
  } while (!response || !callback(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input) {
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}
function chars(input) {
  return true;
}

// helper function to pass in as default promptFor validation
function chars2(input) {
  switch (input) {
    case ("gender"):
      return true;
    case ("dob"):
      return true;
    case ("height"):
      return true;
    case ("weight"):
      return true;
    case ("eyeColor"):
      return true;
    case ("occupation"):
      return true;
    case ("start"):
      return true;
    default:
      return false;
  }
}

function charsRegEx(input) {
  let pattern = /(gender|dob|height|weight|eye color|occupation|start)/i;
  return pattern.test(input); // default validation only
}