/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){

  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch(searchType){
    case 'yes':
      // TODO: search by name
      let person = searchByName(people);
      mainMenu(person, people);
      break;
    case 'no':
      // TODO: search by traits
      let person = searchByTraits(people);
      mainMenu(person, people);
      break;
    default:
      alert("Invalid input. Please try again!");
      app(people); // restart app
    break;
  }
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  var displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
      displayPerson(person);
      // TODO: get person's info
      break;
    case "family":
      let family = searchForFamily(person, people);
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

function searchByName(people){
  var firstName = promptFor("What is the person's first name?", chars);
  var lastName = promptFor("What is the person's last name?", chars);

  let filteredPeople = people.filter(function(el) {
    if(el.firstName === firstName && el.lastName === lastName) {
      return el;
    }
  });
  // TODO: What to do with filteredPeople?
  return filteredPeople.shift();
}

function searchByTraits(people, traits = []){
  var trait = promptFor("Please enter what you would like to search for('Gender','Dob','Height','Weight','Eye Color','Occupation'). \nType 'stop' to quit searching.",chars);
  
  if(trait === "quit" ){
  }

}


 var searchForFamily = (person, people) => people.filter(x => x.currentSpouse == person.id || x.parents.includes(person.id))
    .concat(person.parents.map(parentId => people.reduce((parent,el) => el.id == parentId ? el : parent )))
    .concat(getSiblings(person.parents, people));

 var searchForDescendants = (person, people, descendants = [], loopCounter = 0) => {
    let children = people.filter(x => x.parents.includes(person.id));

    if (children.length > 0){
        if(loopCounter > 0){
          descendants.push(person);
        }

        children.map(x => searchForDescendants(x, people, descendants, ++loopCounter));
    }
    else{
      descendants.push(person);
    }
    return descendants;
  }

 var getPerson = (id, people) => people.find(x => x.id == id);
 var getSiblings = (parents, people)  => {
   var siblings = [];

   parents.map(parentId => {
     siblings = siblings.concat(people.filter(x => x.parents.includes(parentId)));
   });
   return siblings;
 }


// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
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

function getAge(dob){
  let today = new Date();
  let dobComponents = dob.split('/').map(x => parseInt(x));

  let age = today.getFullYear() - dobComponents[2];
  let month = today.getMonth() - dobComponents[1];
  let day = today.getDate() - dobComponents[0];

  return (month < 0 || (month == 0 && day < 0)) ? age - 1 : age;

}

// function that prompts and validates user input
function promptFor(question, callback){
  do{
    var response = prompt(question).trim();
  } while(!response || !callback(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  switch(input.toLowerCase()){
    case("gender"):
      //do something
      break;
    case("dob"):
      //do something
      break;
    case("height"):
      //do something
      break;
    case("weight"):
      //do something
      break;
    case("eye color"):
      //do something
      break;
    case("occupation"):
      //do something
      break;
    case("occupation"):
      //do something
      break;
    default:
      //do something
      break;
  }
}

function charsRegEx(input){
  let pattern = /(gender|dob|height|weight|eye color|occupation|stop)/i;
  return pattern.test(input); // default validation only
}