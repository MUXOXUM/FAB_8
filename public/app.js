if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = document.getElementById('filters');

let currentFilter = 'all';

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    const task = await addTask({ text, completed: false });
    renderTasks();
    showPushNotification('Добавлена новая задача', text);
  }
  taskInput.value = '';
});

filters.addEventListener('click', (e) => {
  if (e.target.dataset.filter) {
    currentFilter = e.target.dataset.filter;
    renderTasks();
  }
});

taskList.addEventListener('click', async (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = li.dataset.id;
  if (e.target.type === 'checkbox') {
    await toggleTaskCompleted(id);
    renderTasks();
  }
});

async function renderTasks() {
  const tasks = await getTasks();
  taskList.innerHTML = '';
  tasks.filter(filterTask).forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) span.classList.add('completed');

    li.appendChild(checkbox);
    li.appendChild(span);
    taskList.appendChild(li);
  });
}

function filterTask(task) {
  if (currentFilter === 'active') return !task.completed;
  if (currentFilter === 'completed') return task.completed;
  return true;
}

renderTasks();
setInterval(checkReminders, 2 * 60 * 60 * 1000); // каждые 2 часа