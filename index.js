//index.js 

import './style.css';
import reload from './images/reload.png';
import enter from './images/enter.png';
import Tasks from './modules/tasks.js';
import addTask from './modules/addTask.js';
import saveTaskStorage from './modules/saveTask.js';
import displayList from './modules/display.js';
import clearAllSelected from './modules/clearAllSelected.js';

displayList();

const reloadIcon = document.querySelector('.reloadIcon');
const myReload = new Image();
myReload.className = 'reload-icon';
myReload.src = reload;
reloadIcon.appendChild(myReload);

const enterIcon = document.querySelector('.enterIcon');
const myEnter = new Image();
myEnter.className = 'enter-icon';
myEnter.src = enter;
enterIcon.appendChild(myEnter);

const description = document.querySelector('#task');
const enterButton = document.querySelector('.enterIcon');
const clearButton = document.getElementById('clear-btn');

description.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const tasks = new Tasks(description.value);
    saveTaskStorage(tasks);
    addTask(tasks);
    description.value = '';
  }
});

enterButton.addEventListener('click', (event) => {
  event.preventDefault();
  const tasks = new Tasks(description.value);
  saveTaskStorage(tasks);
  addTask(tasks);
  description.value = '';
});

clearButton.addEventListener('click', (e) => {
  e.preventDefault();
  clearAllSelected();
});

//addtask.js

import { editTask, editInput } from './editTask.js';
import deleteTask from './deleteTask.js';
import removeTaskStorage from './removeTask.js';
import checkboxStatus from './checkboxStatus.js';

export default function addTask(tasks) {
  const listContainer = document.querySelector('ul');
  const miniListContainer = document.createElement('li');
  miniListContainer.className = `mini-list-container mini-list-container${tasks.index}`;
  miniListContainer.id = tasks.index;
  listContainer.appendChild(miniListContainer);

  const taskCheck = document.createElement('input');
  taskCheck.className = `task-checkbox task-checkbox${tasks.index}`;
  taskCheck.type = 'checkbox';
  taskCheck.id = tasks.index;
  taskCheck.checked = tasks.completed;
  taskCheck.onchange = checkboxStatus;
  miniListContainer.appendChild(taskCheck);

  const taskDescription = document.createElement('input');
  taskDescription.value = tasks.description;
  taskDescription.className = 'task-description';
  taskDescription.disabled = true;
  taskDescription.id = tasks.index;
  taskDescription.onchange = editInput;
  miniListContainer.appendChild(taskDescription);

  const myThreeDots = document.createElement('img');
  myThreeDots.className = `three-dots-icon testDot testDot${tasks.index}`;
  myThreeDots.id = tasks.index;
  miniListContainer.appendChild(myThreeDots);

  myThreeDots.addEventListener('click', (e) => {
    if (myThreeDots.classList.value === (`three-dots-icon testDot testDot${tasks.index}`)) {
      editTask(e);
      myThreeDots.classList.add('trashcan');
      myThreeDots.classList.remove('three-dots-icon');
    } else if (myThreeDots.classList.value === (`testDot testDot${tasks.index} three-dots-icon`)) {
      editTask(e);
      myThreeDots.classList.add('trashcan');
      myThreeDots.classList.remove('three-dots-icon');
    } else {
      deleteTask(tasks);
      removeTaskStorage(e.target.id, tasks);
    }
  });
}

//checkBoxStatus.js

import getTasks from './getTask.js';
import saveTaskStorage from './saveTask.js';

export default function checkboxStatus(checkStatus) {
  checkStatus = checkStatus.target.id;
  const isChecked = document.querySelector(`.task-checkbox${checkStatus}`);
  const tasksArray = getTasks();
  const index = parseInt(checkStatus, 10) - 1;
  if (isChecked.checked === true) {
    tasksArray[index].completed = true;
  } else {
    tasksArray[index].completed = false;
  }
  saveTaskStorage(tasksArray, true);
}

//clearAllSelected.js

import getTasks from './getTask.js';
import saveTaskStorage from './saveTask.js';

export default function clearAllSelected() {
  let tasks1 = getTasks();
  tasks1 = tasks1.filter((task) => !task.completed);
  saveTaskStorage(tasks1, true);
  window.location.reload();
}

//deleteTasks.js

export default function deleteTask(tasks) {
    tasks = document.querySelector(`.mini-list-container${tasks.index}`);
    const listContainer = document.querySelector('ul');
    listContainer.removeChild(tasks);
}

//display.js

import getTasks from './getTask.js';
import addTask from './addTask.js';

export default function displayList() {
  const tasksArray = getTasks();
  tasksArray.forEach((tasks) => addTask(tasks));
}

//editTask.js

import getTasks from './getTask.js';
import saveTaskStorage from './saveTask.js';

export function editTask(e) {
  const taskDescription = e.target.parentNode.querySelector('.task-description');
  taskDescription.disabled = false;
}

export function editInput() {
  const tasksArray = getTasks();
  this.disabled = true;
  const index = parseInt(this.id, 36);
  tasksArray[index].description = this.value;
  saveTaskStorage(tasksArray, true);
  this.parentNode.querySelector('.testDot').classList.add('three-dots-icon');
  this.parentNode.querySelector('.testDot').classList.remove('trashcan');
}

//getTask.js

export default function getTasks() {
    let tasksArray;
    if (localStorage.getItem('tasks') === null) {
      tasksArray = [];
    } else {
      tasksArray = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasksArray;
}

//removeTask.js

import getTasks from './getTask.js';
import saveTaskStorage from './saveTask.js';

export default function removeTaskStorage(tasksIndex) {
  let tasksArray = getTasks();
  tasksIndex = parseInt(tasksIndex, 10);
  tasksArray = tasksArray.filter((tasks) => tasks.index !== tasksIndex);
  saveTaskStorage(tasksArray, true);
  window.location.reload();
}

//saveTask.js

import getTasks from './getTask.js';

export default function saveTaskStorage(tasks, edit = false) {
  let tasksArray = getTasks();
  if (!edit) {
    tasksArray.push(tasks);
  } else {
    tasksArray = tasks;
  }
  for (let i = 0; i < tasksArray.length; i += 1) {
    tasksArray[i].index = i + 1;
  }
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

//tasks.js

export default class Tasks {
    constructor(description, completed = false, index) {
      this.description = description;
      this.completed = completed;
      this.index = index;
    }
}

