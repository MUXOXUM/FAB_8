const dbName = 'smart-todo';
let db;

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = e => {
      db = e.target.result;
      db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
    };
    request.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
    request.onerror = () => reject();
  });

const getStore = (mode) => db.transaction('tasks', mode).objectStore('tasks');

const getTasks = async () => {
  await openDb();
  return new Promise(resolve => {
    const store = getStore('readonly');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
};

const addTask = async (task) => {
  await openDb();
  return new Promise(resolve => {
    const store = getStore('readwrite');
    const req = store.add(task);
    req.onsuccess = () => {
      task.id = req.result;
      resolve(task);
    };
  });
};

const toggleTaskCompleted = async (id) => {
  await openDb();
  const store = getStore('readwrite');
  const req = store.get(Number(id));
  req.onsuccess = () => {
    const task = req.result;
    task.completed = !task.completed;
    store.put(task);
  };
};

window.getTasks = getTasks;
window.addTask = addTask;
window.toggleTaskCompleted = toggleTaskCompleted;
