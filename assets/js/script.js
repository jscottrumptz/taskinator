let pageContentEl = document.querySelector("#page-content");
let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let taskIdCounter = 0;

let taskFormHandler = function(event) {
    // stop page from refreshing
    event.preventDefault();

    // set variables
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("I feel like you might be forgetting something, take another look and try again");
        return false;
    }

    // reset the form
    formEl.reset();

    // check to see if the data object is being edited
    let isEdit = formEl.hasAttribute("data-task-id");
   
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        let taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
    // package up data as object
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        }

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
  };

let createTaskEl = function(taskDataObj) {
    // create list item
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add list item
    let taskInfoEl = document.createElement("div");

    // give it a class name
    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // create edit and delete buttions as well as the status dropdown
    let taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for the next unique id
    taskIdCounter++;
};

let createTaskActions = function(taskId) {
    // <div> container for the other elements
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    let editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create a status selection dropdown
    let statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    // array of status selction choices
    let statusChoices = ["To Do", "In Progress", "Completed"];

    // for loop to populate selection dropdown
    for(let i =0; i< statusChoices.length; i++) {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

let taskButtonHandler = function(event) {
    // get target element from event
  let targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    let taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    let taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

let editTask = function(taskId) {
    // get task list item element
    let taskSelected = document.querySelector(".task-item[data-task-id='" +taskId + "']");

    // get content from taask name and type
    let taskName = taskSelected.querySelector("h3.task-name").textContent;
    document.querySelector("input[name='task-name']").value = taskName;

    let taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("select[name='task-type']").value = taskType;

    // update the text of the submit button to say "Save Task".
    document.querySelector("#save-task").textContent = "Save Task";

    // this will add the taskId to a data-task-id attribute on the form itself
    formEl.setAttribute("data-task-id", taskId);

    // scroll to top of page
    window.scrollTo(0,0);
};

let completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    // reset the form by removing the task id and changing the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

};

let deleteTask = function(taskId) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" +taskId + "']");
    taskSelected.remove();
};

let taskStatusChangeHandler = function(event) {
    // get the task item's id
    let taskId = event.target.getAttribute("data-task-Id");

    // get the currently selected option's value and convert to lowercase
    let statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
    }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);