const clearAll = document.getElementById('clearAll');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
let listCounter = 0;

// Sort tasks in the UL alphabetically (ignoring case)
// function sortTaskList() {
//     const items = Array.from(taskList.getElementsByTagName('li'));
//     items.sort((a, b) => {
//         const textA = a.childNodes[0].nodeValue.trim().toLowerCase();
//         const textB = b.childNodes[0].nodeValue.trim().toLowerCase();
//         return textA.localeCompare(textB);
//     });
//     items.forEach(li => taskList.appendChild(li)); // Reattach in sorted order
// }

function storeTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.childNodes[0].nodeValue,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = ""
}

// Load tasks from localStorage and render them
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach(task => addTask(task.text, task.completed, false));
    // sortTaskList();
}

// Add tasks from textarea (one per line)
function addTasksFromInput() {
    const lines = taskInput.value.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach(line => addTask(line, false, false));
    taskInput.value = '';
    // sortTaskList();
    storeTasks();
    liCount();
}

// Add a single task to the list (with option not to sort for bulk adds)
function addTask(taskText, completed = false, shouldSort = true) {
    const li = document.createElement('li');
    li.textContent = taskText;

    if (completed) {
        li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `<span id="delBtn"><img src="cross.png" alt=""></span>`;
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        li.remove();
        // sortTaskList();
        storeTasks();
        liCount();
    });

    li.addEventListener('click', function(e) {
        if (e.target !== deleteBtn) {
            li.classList.toggle('completed');
            // sortTaskList();
            storeTasks();
        }
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

  
    storeTasks();
}

// Clear all tasks
function showClear(){
    if(listCounter > 0){
        clearAll.style.display = 'block';
    }
    else{
        clearAll.style.display = 'none';
    }
}

clearAll.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        taskList.innerHTML = '';
        storeTasks();
        liCount();
    }
});

// Add tasks on button click
addBtn.addEventListener('click', addTasksFromInput);

// Add tasks on pressing Enter (without Shift)
taskInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addTasksFromInput();
        liCount();
    }
});

// Handle paste: split pasted text by lines and add as separate tasks
taskInput.addEventListener('paste', function(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length > 1) {
        lines.forEach(line => addTask(line, false, false));
        taskInput.value = '';
        // sortTaskList();
        storeTasks();
        liCount();
    } else {
        document.execCommand('insertText', false, text);
    }
});

// Store tasks on every input in the task input field
taskInput.addEventListener('input', function() {
    localStorage.setItem('taskInputDraft', taskInput.value);
});

// Restore draft input if available
window.addEventListener('DOMContentLoaded', function() {
    const draft = localStorage.getItem('taskInputDraft');
    if (draft) {
        taskInput.value = draft;
    }
    loadTasks();
    liCount();
});

function liCount(){
    listCounter = taskList.getElementsByTagName("li").length;
    document.getElementById("liCount").innerText = listCounter;
    showClear();
}

liCount();
