document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const remainingCount = document.getElementById('remainingCount');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });
        
        updateRemainingCount();
    }
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            taskInput.value = '';
            renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
        }
    }
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    function updateRemainingCount() {
        const count = tasks.filter(task => !task.completed).length;
        remainingCount.textContent = count;
    }
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('task-checkbox')) {
            toggleTask(parseInt(e.target.dataset.index));
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(parseInt(e.target.dataset.index));
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });
    renderTasks();
});
