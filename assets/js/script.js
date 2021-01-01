let buttonE1 = document.querySelector("#save-task");
let tasksToDoEl = document.querySelector("#tasks-to-do");

let createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.appendChild(listItemEl);
}

buttonE1.addEventListener("click", createTaskHandler);