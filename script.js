// DOM element references
const input = document.getElementById('taskInput');
const button = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const toggleBtn = document.getElementById('toggleTheme');

function showAlert(message, duration = 3000) {
  const alertBox = document.getElementById('customAlert');
  const alertMessage = document.getElementById('alertMessage');

  alertMessage.textContent = message;

  // تغییر تم اگر دارک مود فعاله
  if (document.body.classList.contains('dark-mode')) {
    alertBox.classList.add('dark');
  } else {
    alertBox.classList.remove('dark');
  }

  alertBox.classList.remove('hidden');
  alertBox.classList.add('show');

  setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => alertBox.classList.add('hidden'), 400); // بعد از انیمیشن
  }, duration);
}

// Apply saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) document.body.classList.add('dark-mode');
});

// Theme toggle button handler
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Create a task list item element
function createTaskElement(taskText, isCompleted = false) {
    const li = document.createElement('li');
    li.className = 'taskItem';

    const span = document.createElement('span');
    span.className = 'taskText';
    span.textContent = taskText;
    if (isCompleted) span.classList.add('completed');

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'taskButtons';

    const doneBtn = document.createElement('button');
    doneBtn.className = 'doneBtn';
    doneBtn.onclick = () => {
        span.classList.toggle('completed');
        updateLocalStorage();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.onclick = () => {
        taskList.removeChild(li);
        updateLocalStorage();
    };

    buttonContainer.appendChild(doneBtn);
    buttonContainer.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonContainer);
    return li;
}

// Save all current tasks to localStorage
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.taskItem').forEach(li => {
        const text = li.querySelector('.taskText').textContent;
        const completed = li.querySelector('.taskText').classList.contains('completed');
        tasks.push({ text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Save a new task to localStorage
function saveTaskToLocalStorage(taskText, completed = false) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage and render them
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text, task.completed);
        taskList.appendChild(taskElement);
    });
}

// Add new task on button click
button.addEventListener('click', () => {
    const taskText = input.value.trim();
    if (taskText) {
        const taskElement = createTaskElement(taskText);
        taskList.appendChild(taskElement);
        saveTaskToLocalStorage(taskText);
        input.value = '';
    } else {
        showAlert('Please enter a task.');
    }
});

// Add new task on Enter key press
input.addEventListener('keyup', e => {
    if (e.key === 'Enter') button.click();
});

// Load tasks when the page loads
window.onload = loadTasksFromLocalStorage;
