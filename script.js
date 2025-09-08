const clearAll = document.getElementById('clearAll');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
let listCounter = 0;
// Save tasks to localStorage as an array of objects
// The storeTasks function saves the current list of tasks to the browser's localStorage.
// It does this by collecting all <li> elements (each representing a task) from the taskList.
// For each <li>, it creates an object with two properties:
//   - text: the text content of the task (taken from the first child node of the <li>)
//   - completed: a boolean indicating whether the task is marked as completed (i.e., if the <li> has the 'completed' class)
// All these task objects are put into an array called 'tasks'.
// The array is then converted to a JSON string and saved in localStorage under the key 'tasks'.
// Finally, the function clears the input field (taskInput.value = "").


function storeTasks() {
    const tasks = [];
    // Loop through all <li> elements in the task list
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            // Get the text of the task (assumes the first child node is the text)
            text: li.childNodes[0].nodeValue,
            // Check if the task is marked as completed
            completed: li.classList.contains('completed')
        });
        
    });
    // Save the tasks array to localStorage as a JSON string
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Clear the input field after storing
    taskInput.value = ""
}

// Load tasks from localStorage and render them
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach(task => addTask(task.text, task.completed));
}

// Add tasks from textarea (one per line)
function addTasksFromInput() {
    const lines = taskInput.value.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach(line => addTask(line));
    taskInput.value = '';
    storeTasks();
    liCount();
}

// Add a single task to the list
function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;

    if (completed) {
        li.classList.add('completed');
    }

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `<span id="delBtn"><img src="cross.png" alt=""></span>`;
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        li.remove();
        storeTasks();
        liCount();
    });

    // Toggle completed on click
    li.addEventListener('click', function(e) {
        if (e.target !== deleteBtn) {
            li.classList.toggle('completed');
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
    if (confirm('Are you sure you want to clear all tasks?'))
         {
        taskList.innerHTML = '';    
        storeTasks();
        liCount();
    }   
});
// Add tasks on button click
addBtn.addEventListener('click', addTasksFromInput,liCount);

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
        // Add all lines as tasks immediately
        lines.forEach(line => addTask(line));
        taskInput.value = '';
        storeTasks();
    } else {
        // Default paste for single line
        document.execCommand('insertText', false, text);
    }
});

// Store tasks on every input in the task input field
taskInput.addEventListener('input', function() {
    // This only stores the input field value, not the task list
    // If you want to store the input as a draft, you can do so here
    localStorage.setItem('taskInputDraft', taskInput.value,listCounter);
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
// setInterval(liCount, 100);

// Initial count update
liCount();