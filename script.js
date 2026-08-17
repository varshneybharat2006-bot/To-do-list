// ===============================
// To-Do List Application
// ===============================

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");


// ===============================
// STATE
// ===============================

// Get tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Current filter
let currentFilter = "all";


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ===============================
// CREATE TASK
// ===============================

function addTask() {

    const taskText = taskInput.value.trim();

    // Check empty input
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create new task
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add task to state
    tasks.push(newTask);

    // Save to localStorage
    saveTasks();

    // Clear input
    taskInput.value = "";

    // Display tasks
    renderTasks();
}


// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {

    // Clear existing list
    taskList.innerHTML = "";

    // Filter tasks
    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });
    }


    // Empty message
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.className = "empty-message";

        emptyMessage.textContent = "No tasks found.";

        taskList.appendChild(emptyMessage);

    }


    // Create task elements
    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task";

        li.dataset.id = task.id;


        // Add completed class
        if (task.completed) {
            li.classList.add("completed");
        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;


        // Task text
        const span = document.createElement("span");

        span.className = "task-text";

        span.textContent = task.text;


        // Edit button
        const editButton = document.createElement("button");

        editButton.className = "edit-btn";

        editButton.textContent = "Edit";


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";


        // Add elements to li
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);


        // Add task to list
        taskList.appendChild(li);
    });


    // Update count
    updateTaskCount();
}


// ===============================
// UPDATE TASK COUNT
// ===============================

function updateTaskCount() {

    const activeTasks = tasks.filter(function(task) {
        return !task.completed;
    });

    taskCount.textContent =
        activeTasks.length +
        (activeTasks.length === 1 ? " task" : " tasks") +
        " remaining";
}


// ===============================
// EVENT DELEGATION
// ===============================

taskList.addEventListener("click", function(event) {

    const taskElement = event.target.closest(".task");

    if (!taskElement) {
        return;
    }

    const taskId = Number(taskElement.dataset.id);

    // ===========================
    // DELETE
    // ===========================

    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(function(task) {
            return task.id !== taskId;
        });

        saveTasks();

        renderTasks();
    }


    // ===========================
    // EDIT
    // ===========================

    if (event.target.classList.contains("edit-btn")) {

        const task = tasks.find(function(task) {
            return task.id === taskId;
        });

        const newText = prompt("Edit your task:", task.text);

        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();

            renderTasks();
        }
    }

});


// ===============================
// CHECKBOX EVENT
// ===============================

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("task-checkbox")) {
        return;
    }

    const taskElement = event.target.closest(".task");

    const taskId = Number(taskElement.dataset.id);


    const task = tasks.find(function(task) {
        return task.id === taskId;
    });


    if (task) {

        task.completed = event.target.checked;

        saveTasks();

        renderTasks();
    }

});


// ===============================
// FILTERS
// ===============================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Add active class
        button.classList.add("active");

        // Change filter
        currentFilter = button.dataset.filter;

        // Render tasks
        renderTasks();
    });

});


// ===============================
// ADD BUTTON
// ===============================

addBtn.addEventListener("click", addTask);


// ===============================
// ENTER KEY
// ===============================

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// ===============================
// INITIAL LOAD
// ===============================

renderTasks();