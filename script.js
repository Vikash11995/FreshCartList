const clearAll = document.getElementById('clearAll');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
let listCounter = 0;

// copy code start from here

const copyBtn = document.getElementById("copyAll");

copyBtn.addEventListener("click", async () => {
  // Collect the plain text content from each task <li>
  const items = taskList.querySelectorAll('li');
  if (!items.length) return;

  const text = Array.from(items)
    .map((el, i) => `${i + 1}. ${el.textContent.replace(/[\r\n]+/g,"").replace(/(\s)+$/, "").replace(/(\s)*$/, "").replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/[\s\u200B-\u200D\uFEFF]+$/, "")}`.replace(/(\s)+$/, ""))
    .map(line => line.replace(/(×)+$/,"").trim())
    .join('\n');

  if (!text.trim()) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy All"), 1500);
  } catch (err) {
    console.error("Copy failed:", err);
  }
});

// copy code ends here

function storeTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        // Get the task text (exclude the delete button)
        let text = "";
        // Get the text up to the first child that is a button
        for (const node of li.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.nodeValue;
            }
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BUTTON") {
                break;
            }
        }
        tasks.push({
            text: text.trim(),
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = "";
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
    // Instead of setting textContent, use a span for task text for extensibility
    const textSpan = document.createElement('span');
    textSpan.className = "todo-text";
    textSpan.textContent = taskText;

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

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);

    li.addEventListener('click', function(e) {
        if (e.target !== deleteBtn && !deleteBtn.contains(e.target)) {
            li.classList.toggle('completed');
            // sortTaskList();
            storeTasks();
        }
    });

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
