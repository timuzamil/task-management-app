
document.addEventListener('DOMContentLoaded', loadTasks);


document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', filterTasks);
});
document.getElementById('searchTask').addEventListener('input', searchTasks);

function loadTasks() {
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    
    tasks.forEach(task => createTaskElement(task));
    
    
    filterTasks();
}

function addTask() {
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const date = document.getElementById('taskDate').value;

    
    if (title && date) {
        const task = { title, description, date, completed: false };
        
       
        createTaskElement(task);
        
       
        saveTask(task);
        
        
        clearForm();
    } else {
        
        alert('Task title and due date are required.');
    }
}

function createTaskElement(task) {
    const taskList = document.getElementById('taskList');

    
    const taskItem = document.createElement('li');

   
    const taskDetails = document.createElement('div');
    taskDetails.classList.add('task-details');


    if (task.completed) {
        taskItem.classList.add('completed');
    }

    
    taskDetails.innerHTML = `
        <span>${task.title}</span>
        <p>${task.description}</p>
        <small>Due: ${task.date}</small>
    `;

    
    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    
    const completeButton = document.createElement('button');
    completeButton.classList.add('complete-btn');
    completeButton.textContent = task.completed ? 'Undo' : 'Complete';
    completeButton.addEventListener('click', () => toggleComplete(taskItem, completeButton, task.title));


    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(taskItem, task.title));


    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(taskItem, task.title));


    taskActions.appendChild(completeButton);
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);


    taskItem.appendChild(taskDetails);
    taskItem.appendChild(taskActions);
    
    
    taskList.appendChild(taskItem);
}

function saveTask(task) {
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
   
    tasks.push(task);
    
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearForm() {
    
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDate').value = '';
}

function toggleComplete(taskItem, button, title) {
    
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    
    const task = tasks.find(task => task.title === title);
    
   
    task.completed = !task.completed;
    

    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    
    taskItem.classList.toggle('completed');
    button.textContent = task.completed ? 'Undo' : 'Complete';
    
    
    filterTasks();
}

function editTask(taskItem, title) {
    
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    
    const task = tasks.find(task => task.title === title);

    
    const newTitle = prompt('Edit Task Title:', task.title);
    const newDescription = prompt('Edit Task Description:', task.description);
    const newDate = prompt('Edit Due Date:', task.date);

    
    if (newTitle && newDate) {
        task.title = newTitle.trim();
        task.description = newDescription ? newDescription.trim() : '';
        task.date = newDate;

        
        taskItem.querySelector('.task-details span').textContent = task.title;
        taskItem.querySelector('.task-details p').textContent = task.description;
        taskItem.querySelector('.task-details small').textContent = `Due: ${task.date}`;

        
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        
        alert('Task title and due date are required.');
    }
}

function deleteTask(taskItem, title) {
    
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    
    const updatedTasks = tasks.filter(task => task.title !== title);
    
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    
    taskItem.remove();
    
    
    filterTasks();
}

function filterTasks() {
    
    const filter = document.querySelector('input[name="filter"]:checked').value;
    
    
    const tasks = document.querySelectorAll('#taskList li');

    
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
   
    const searchTerm = document.getElementById('searchTask').value.toLowerCase();
    
   
    const tasks = document.querySelectorAll('#taskList li');

     
    tasks.forEach(task => {
        const title = task.querySelector('.task-details span').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}
