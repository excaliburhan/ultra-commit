// 获取DOM元素
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter');

// 初始化任务数组
let tasks = [];
let currentFilter = 'all';

// 从本地存储加载任务
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

// 保存任务到本地存储
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 更新任务计数
function updateTaskCount() {
  const activeTasks = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${activeTasks} 个待办事项`;
}

// 渲染任务列表
function renderTasks() {
  // 清空任务列表
  taskList.innerHTML = '';

  // 根据当前过滤器过滤任务
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  // 创建任务项
  filteredTasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
    taskItem.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-task';
    deleteBtn.innerHTML = '&times;';

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);

    taskList.appendChild(taskItem);
  });

  updateTaskCount();
}

// 添加新任务
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // 清空输入框
    taskInput.value = '';
    taskInput.focus();
  }
}

// 切换任务完成状态
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// 删除任务
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// 清除已完成的任务
function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

// 设置过滤器
function setFilter(filter) {
  currentFilter = filter;

  // 更新过滤器按钮状态
  filterButtons.forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderTasks();
}

// 事件监听器
// 添加任务按钮点击
addTaskBtn.addEventListener('click', addTask);

// 输入框回车键
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// 任务列表点击事件（使用事件委托）
taskList.addEventListener('click', (e) => {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) {
    return;
  }

  const taskId = taskItem.dataset.id;

  // 点击复选框
  if (e.target.classList.contains('task-checkbox')) {
    toggleTask(taskId);
  }

  // 点击删除按钮
  if (e.target.classList.contains('delete-task')) {
    deleteTask(taskId);
  }
});

// 清除已完成按钮点击
clearCompletedBtn.addEventListener('click', clearCompleted);

// 过滤器按钮点击
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setFilter(btn.dataset.filter);
  });
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  setFilter('all');
});
