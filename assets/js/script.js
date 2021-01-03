let tasks = [];
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
            type: taskTypeInput,
            status: "to do"
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
    listItemEl.setAttribute("draggable","true");

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

    // creat an id tag and push the new object to the array
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // save tasks to localStorage
    saveTasks();

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

    // loop through tasks array and task object with new content
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
        }
    }

    // save tasks to localStorage
    saveTasks();

    alert("Task Updated!");

    // reset the form by removing the task id and changing the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

};

let deleteTask = function(taskId) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" +taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    let updatedTaskArr = [];

    // loop through current tasks
    for (let i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
        updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    // save tasks to localStorage
    saveTasks();

    alert("Task Deleted!");
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

    // update task's in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
        }
    }

    // save tasks to localStorage
    saveTasks();
};

let dragTaskHandler = function(event) {
    // get the task id
    let taskId = event.target.getAttribute("data-task-id");
    // store the id in the dataTransfer property
    event.dataTransfer.setData("text/plain", taskId);

    let getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
};

// defines the drop zone area
let dropZoneDragHandler = function(event) {
    // finds any task-list object or any of it's children
    let taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      event.preventDefault();
      taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

let dropTaskHandler = function(event) {
    let id = event.dataTransfer.getData("text/plain");
    let draggableElement = document.querySelector("[data-task-id='" + id + "']");
    let dropZoneEl = event.target.closest(".task-list");
    let statusType = dropZoneEl.id;

    // set status of task based on dropZone id
    let statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    
    // change dropdown with selected index
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    } 
    else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
    } 
    else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.removeAttribute("style");

    // move the li to the appropriate task list
    dropZoneEl.appendChild(draggableElement);

    // loop through tasks array to find and update the updated task's status
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
        tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }

    // save tasks to localStorage
    saveTasks();
};

let dragLeaveHandler = function(event) {
    let taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      taskListEl.removeAttribute("style");
    }
};

// save data to local storage
let saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

let loadTasks = function() {
    // Gets task items from localStorage and covert them from a string back to an array.
    tasks = JSON.parse(localStorage.getItem("tasks"));

    // if there are no locally stored tasks, set up empty array
    if (!tasks) {
        tasks = [];
    }
    
    // Iterates through a tasks array and creates task elements on the page from it.
    for (let i = 0; i < tasks.length; i++) {
        // reset task ids
        tasks[i].id = taskIdCounter;

        // create list item
        let listItemEl = document.createElement("li");
        listItemEl.className = "task-item";

        // add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        listItemEl.setAttribute("draggable","true");

        // create div to hold task info and add list item
        let taskInfoEl = document.createElement("div");

        // give it a class name
        taskInfoEl.className = "task-info";

        // add HTML content to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        // create edit and delete buttions as well as the status dropdown
        let taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);

        // add entire list item to the propper list
        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        } 
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        } 
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskIdCounter++;
    }

    console.log(tasks)
};

// create new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the states dropdown
pageContentEl.addEventListener("change", taskStatusChangeHandler);

// for dragging
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks();