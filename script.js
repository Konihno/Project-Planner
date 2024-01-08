const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const statusFilter = document.getElementById('statusFilter');
const taskList = document.getElementById('taskList');
const deleteCompletedButton = document.getElementById('deleteCompleted');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
updateUI();

document.getElementById('submitTask').addEventListener('click', handleAddTask);
taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleAddTask();
    }
});
deleteCompletedButton.addEventListener('click', deleteCompletedTasks);

taskList.addEventListener('change', function (event) {
    if (event.target.type === 'checkbox') {
        const index = event.target.dataset.index;
        markAsCompleted(index);
    }
});

statusFilter.addEventListener('change', updateUI);

function handleAddTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const status = "todo"; // Par défaut, une nouvelle tâche est marquée comme "à faire"
    addTask(taskText, dueDate, status);
    taskInput.value = '';
    dueDateInput.value = '';
}

function addTask(taskText, dueDate, status) {
    if (taskText !== '') {
        const newTask = { text: taskText, dueDate: dueDate, status: status, completed: false, createdAt: new Date().toISOString() };
        tasks.push(newTask);
        updateLocalStorage();
        updateUI();
    }
}

function markAsCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    updateLocalStorage();
    updateUI();
}

function deleteCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    updateLocalStorage();
    updateUI();
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateUI() {
    const filteredTasks = filterTasksByStatus(tasks, statusFilter.value);
    taskList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add(task.completed ? 'completed' : null);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.dataset.index = index;

        const taskText = document.createElement('span');
        taskText.textContent = `${task.text} (Due: ${task.dueDate}) - Status: ${task.status}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(index));

        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}

function filterTasksByStatus(tasks, status) {
    if (status === 'all') {
        return tasks;
    } else {
        return tasks.filter(task => task.completed ? status === 'done' : task.status === status);
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateLocalStorage();
    updateUI();
}