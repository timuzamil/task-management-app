// Load tasks from localStorage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listeners for adding a task and filtering tasks
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', filterTasks);
});
document.getElementById('searchTask').addEventListener('input', searchTasks);

function loadTasks() {
    // Retrieve tasks from localStorage or set to an empty array if none exist
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Create the HTML elements for each task
    tasks.forEach(task => createTaskElement(task));
    
    // Apply the current filter after loading tasks
    filterTasks();
}

function addTask() {
    // Get the values from the input fields
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const date = document.getElementById('taskDate').value;

    // Validate that the title and date are provided
    if (title && date) {
        const task = { title, description, date, completed: false };
        
        // Create the task element in the DOM
        createTaskElement(task);
        
        // Save the task to localStorage
        saveTask(task);
        
        // Clear the input form fields
        clearForm();
    } else {
        // Alert the user if required fields are missing
        alert('Task title and due date are required.');
    }
}

function createTaskElement(task) {
    const taskList = document.getElementById('taskList');

    // Create a list item element to hold the task
    const taskItem = document.createElement('li');

    // Create a div to hold the task details (title, description, date)
    const taskDetails = document.createElement('div');
    taskDetails.classList.add('task-details');

    // If the task is completed, apply a 'completed' class
    if (task.completed) {
        taskItem.classList.add('completed');
    }

    // Set the inner HTML of the task details with title, description, and due date
    taskDetails.innerHTML = `
        <span>${task.title}</span>
        <p>${task.description}</p>
        <small>Due: ${task.date}</small>
    `;

    // Create a div to hold action buttons (Complete, Edit, Delete)
    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    // Create a button to mark the task as complete or undo the completion
    const completeButton = document.createElement('button');
    completeButton.classList.add('complete-btn');
    completeButton.textContent = task.completed ? 'Undo' : 'Complete';
    completeButton.addEventListener('click', () => toggleComplete(taskItem, completeButton, task.title));

    // Create an Edit button to allow task editing
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(taskItem, task.title));

    // Create a Delete button to remove the task
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(taskItem, task.title));

    // Append the buttons to the task actions div
    taskActions.appendChild(completeButton);
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    // Append the task details and actions to the task item
    taskItem.appendChild(taskDetails);
    taskItem.appendChild(taskActions);
    
    // Add the task item to the task list in the DOM
    taskList.appendChild(taskItem);
}

function saveTask(task) {
    // Retrieve the existing tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Add the new task to the array of tasks
    tasks.push(task);
    
    // Save the updated array back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearForm() {
    // Clear the input fields for the task form
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDate').value = '';
}

function toggleComplete(taskItem, button, title) {
    // Retrieve the tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    // Find the task by title
    const task = tasks.find(task => task.title === title);
    
    // Toggle the completed status of the task
    task.completed = !task.completed;
    
    // Save the updated tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Update the DOM to reflect the completed status
    taskItem.classList.toggle('completed');
    button.textContent = task.completed ? 'Undo' : 'Complete';
    
    // Reapply the filter to show/hide tasks as needed
    filterTasks();
}

function editTask(taskItem, title) {
    // Retrieve the tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    // Find the task by title
    const task = tasks.find(task => task.title === title);

    // Prompt the user for new task details
    const newTitle = prompt('Edit Task Title:', task.title);
    const newDescription = prompt('Edit Task Description:', task.description);
    const newDate = prompt('Edit Due Date:', task.date);

    // Validate that the new title and date are provided
    if (newTitle && newDate) {
        task.title = newTitle.trim();
        task.description = newDescription ? newDescription.trim() : '';
        task.date = newDate;

        // Update the task details in the DOM
        taskItem.querySelector('.task-details span').textContent = task.title;
        taskItem.querySelector('.task-details p').textContent = task.description;
        taskItem.querySelector('.task-details small').textContent = `Due: ${task.date}`;

        // Save the updated tasks back to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        // Alert the user if required fields are missing
        alert('Task title and due date are required.');
    }
}

function deleteTask(taskItem, title) {
    // Retrieve the tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    // Filter out the task to be deleted
    const updatedTasks = tasks.filter(task => task.title !== title);
    
    // Save the updated tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Remove the task from the DOM
    taskItem.remove();
    
    // Reapply the filter to show/hide tasks as needed
    filterTasks();
}

function filterTasks() {
    // Get the selected filter value (all, completed, or uncompleted)
    const filter = document.querySelector('input[name="filter"]:checked').value;
    
    // Get all the tasks in the DOM
    const tasks = document.querySelectorAll('#taskList li');

    // Show/hide tasks based on the filter
    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed':
                task.style.display = isCompleted ? 'flex' : 'none';
                break;
            case 'uncompleted':
                task.style.display = !isCompleted ? 'flex' : 'none';
                break;
        }
    });
}

function searchTasks() {
    // Get the search term from the input field
    const searchTerm = document.getElementById('searchTask').value.toLowerCase();
    
    // Get all the tasks in the DOM
    const tasks = document.querySelectorAll('#taskList li');

    // Show/hide tasks based on whether they match the search term
    tasks.forEach(task => {
        const title = task.querySelector('.task-details span').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}
