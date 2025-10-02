// App Navigation
function openTab(tabNumber) {
  for (let i = 1; i < 5; i++) {
    if (i === tabNumber) {
      document.getElementById(`tab-${tabNumber}`).style.display = "flex";
      document.getElementById(`tab-icon-${tabNumber}`).style.background = "rgb(132, 165, 157)";
    } else {
      document.getElementById(`tab-${i}`).style.display = "none";
      document.getElementById(`tab-icon-${i}`).style.background = "lightgrey";
    }
  }
}

function openScreen(tabNumber, screenNumber, numberOfScreensInTab) {
  for (let i = 1; i <= numberOfScreensInTab; i++) {
    const screen = document.getElementById(`tab-${tabNumber}-screen-${i}`);
      screen.style.display = (i === screenNumber) ? "flex" : "none";

  }
}


function openKeyboard() {
  document.getElementById("keyboard").style.display = 'flex';
}

function closeKeyboard() {
  document.getElementById("keyboard").style.display = 'none';
}


let exercises = [["", "", ""]];
const muscles = ["chest", "triceps", "biceps", "lats", "upper-back", "shoulders", "abs", "quads", "hamstrings", "glutes"];
const recommendedSets = ["4", "5", "6"];
const recommendedReps = Array.from({ length: 33 }, (_, i) => `${i + 16}`); // Generate reps from 16 to 48

function handleDisplayExercise() {
  const ret = `
    <table "tab-2-screen-1-table" >
        <tr>
          <th>Muscle</th>
          <th>Total Sets</th>
          <th>Total Reps</th>
          <th> </th>
        </tr>
      <tr></tr>
        ${exercises.map((exercise, idx) => `
          <tr>
            <td>
              <select onchange="handleEditWorkout(${idx}, 0, 'tab-2-screen-1-selector-${idx}')" class="tab-2-screen-1-selector" id="tab-2-screen-1-selector-${idx}">
                <option name="blank" disabled selected hidden></option>
                ${muscles.map(muscle => `
                  <option value="${muscle}" ${muscle === exercise[0] ? 'selected' : ''}>
                    ${muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </option>
                `).join('')}
              </select>
            </td>
            <td>
              <input type="number" onclick="openKeyboard()" onfocusout="closeKeyboard()" value="${exercise[1]}" 
                     onchange="handleEditWorkout(${idx}, 1, 'tab-2-screen-1-sets-${idx}')" 
                     class="tab-2-screen-1-sets" id="tab-2-screen-1-sets-${idx}" />
            </td>
            <td>
              <input type="number" onclick="openKeyboard()" onfocusout="closeKeyboard()" value="${exercise[2]}" 
                     onchange="handleEditWorkout(${idx}, 2, 'tab-2-screen-1-reps-${idx}')" 
                     class="tab-2-screen-1-reps" id="tab-2-screen-1-reps-${idx}" />
            </td>
            <td>
              <button onclick="handleRemoveExercise(${idx})" id="tab-2-screen-1-remove-button-${idx}">Remove</button>
            </td>
          </tr>
        `).join('')}
    </table>`;
  document.getElementById("tab-2-screen-1-display").innerHTML = ret;
}


function handleEditWorkout(index, type, id) {
  const value = document.getElementById(id).value;
  exercises[index][type] = value;
}

function handleAddExercise() {
  exercises.push(["", "", ""]);
  handleDisplayExercise();
}

function handleRemoveExercise(index) {
  exercises.splice(index, 1);
  handleDisplayExercise();
}

function handleEvaluateWorkout() {
  const overInefficientExercises = [];
  const underInefficientExercises = muscles.filter(muscle => !exercises.some(ex => ex[0] === muscle));
  const efficientExercises = [];

  exercises.forEach(([muscle, sets, reps]) => {
    if (recommendedSets.includes(sets) && recommendedReps.includes(reps)) {
      efficientExercises.push(muscle);
    } else if (reps > 48) {
      overInefficientExercises.push(muscle);
    } else {
      underInefficientExercises.push(muscle);
    }
  });

  const score = Math.max(0, 100 - ((overInefficientExercises.length + underInefficientExercises.length) * 10));

  const ret = `
    <h3 id="tab-2-screen-2-header">Workout Score: ${score}/100.</h3>
    <br>
    <table border="1">
      <tr>
        <td><strong>Muscle Groups Properly Worked<strong></td>
        <td><ul>${efficientExercises.map(muscle => `<li>${muscle}</li>`).join('')}</ul></td>
      </tr>
      <tr>
        <td rowspan="2"><strong>Potential Issues</strong></td>
        <td><strong>Overworked Muscle Groups</strong><br>
          <ul>${overInefficientExercises.map(muscle => `<li>${muscle}</li>`).join('')}</ul>
        </td>
      </tr>
      <tr>
        <td><strong>Underworked Muscle Groups</strong><br>
          <ul>${underInefficientExercises.map(muscle => `<li>${muscle}</li>`).join('')}</ul>
        </td>
      </tr>
    </table>`;
  document.getElementById("tab-2-screen-2-body").innerHTML = ret;
  openScreen(2, 2, 2);
}

document.addEventListener('DOMContentLoaded', handleDisplayExercise);





let totalCalories = 0;
let totalCarbs = 0;
let totalProteins = 0;
let totalFats = 0;

// Function to add close button to a list item
function addCloseButton(li, carbs, proteins, fats, itemCals) {
  const span = document.createElement("SPAN");
  span.className = "tab-3-screen-1-close";
  span.textContent = "\u00D7";

  // Close button functionality to remove list item and update calorie count
  span.onclick = function () {

    totalCalories -= itemCals;
    totalCarbs -= carbs;
    totalProteins -= proteins;
    totalFats -= fats;

    // Update calorie and macronutrient displays
    document.getElementById("cal-total").value = `Total Calories = ${totalCalories}`;
    document.getElementById("carb-total").value = `${totalCarbs}g Carbs`;
    document.getElementById("protein-total").value = `${totalProteins}g Protein`;
    document.getElementById("fat-total").value = `${totalFats}g Fats`;

    li.remove();
  };

  // Append the close button to the list item
  li.appendChild(span);
}

// Function to create a new list item
function newElement() {
  const foodNameValue = document.getElementById("tab-3-screen-1-listInput1").value;
  const carbsCaloriesValue = document.getElementById("tab-3-screen-1-listInput2").value;
  const proteinCaloriesValue = document.getElementById("tab-3-screen-1-listInput3").value;
  const fatsCaloriesValue = document.getElementById("tab-3-screen-1-listInput4").value;

  if (foodNameValue === '' || carbsCaloriesValue === '' || isNaN(carbsCaloriesValue) ||
    proteinCaloriesValue === '' || isNaN(proteinCaloriesValue) ||
    fatsCaloriesValue === '' || isNaN(fatsCaloriesValue)) {
    alert("You must write both valid food names and valid calorie values!");
    return;
  }

  const carbs = parseInt(carbsCaloriesValue);
  const proteins = parseInt(proteinCaloriesValue);
  const fats = parseInt(fatsCaloriesValue);
  const itemCals = carbs + proteins + fats;

  // Create new list item with food and calorie info
  const li = document.createElement("li");
  li.className = "tab-3-screen-1-li";
  li.innerHTML = `${foodNameValue} <br> Carbs: ${carbs} &nbsp;&nbsp; Proteins:${proteins} &nbsp;&nbsp; Fats:${fats}  <br> Total Cals: ${itemCals} `;

  // Add close button to new list item, passing macronutrient values for removal calculations
  addCloseButton(li, carbs, proteins, fats, itemCals);

  // Append new item to the list
  document.getElementById("tab-3-screen-1-myUL").appendChild(li);

  // Update total calories and macronutrients
  totalCalories += itemCals;
  totalCarbs += carbs;
  totalProteins += proteins;
  totalFats += fats;

  document.getElementById("carb-total").value = `${totalCarbs} Cals. Carbs`;
  document.getElementById("protein-total").value = `${totalProteins} Cals. Proteins`;
  document.getElementById("fat-total").value = `${totalFats} Cals. Fats`;
  document.getElementById("cal-total").value = `Total: ${totalCalories} Cals.`;


  // Clear input fields
  document.getElementById("tab-3-screen-1-listInput1").value = "";
  document.getElementById("tab-3-screen-1-listInput2").value = "";
  document.getElementById("tab-3-screen-1-listInput3").value = "";
  document.getElementById("tab-3-screen-1-listInput4").value = "";
}


function editInfo() {
  var name = document.getElementById("newName").value;
  var age = document.getElementById("newAge").value;
  var feet = parseFloat(document.getElementById("newFeet").value);
  var inches = parseFloat(document.getElementById("newInches").value);
  var weight = parseFloat(document.getElementById("newWeight").value);
  var weightGoal = parseFloat(document.getElementById("newWeightGoal").value);
 
  document.getElementById("profileName").innerHTML = name;
  document.getElementById("profileAge").innerHTML = age;
  document.getElementById("profileFeet").innerHTML = feet;
  document.getElementById("profileInches").innerHTML = inches;
  document.getElementById("profileWeight").innerHTML = weight;
  document.getElementById("profileWeightGoal").innerHTML = weightGoal;
 

  let bmi = (weight * 703) / (((feet * 12) + inches) * ((feet * 12) + inches));
  document.getElementById("profileBMI").innerHTML = bmi.toFixed(1);
  openScreen(4, 1, 2);
}