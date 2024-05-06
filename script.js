const toggleBtn = document.getElementById('toggle-btn');

const taskInput = document.getElementById('task-input');
const taskContainer = document.getElementById('tasks-container');

const allBtn = document.getElementById('all-btn');
const activeBtn = document.getElementById('active-btn');
const completedBtn = document.getElementById('completed-btn');
const clearBtn = document.getElementById('clear-btn');


let theme = localStorage.getItem('theme') || 'dark';

const applyTheme = (theme) => {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const info = document.querySelector(".info");
    const taskField = document.querySelectorAll('.task');
    const inputLabel = document.querySelector(".task-input-label");
    const checkboxLight = document.querySelectorAll('input[type=checkbox]');
    const buttonContainer = document.getElementById('buttons-container');
    const btnRight = document.querySelector(".btn-right");
    const btnMiddle = document.querySelectorAll(".btn-middle");
    const shadow = document.querySelector('.shadow');

    body.classList.toggle("light-theme", theme === 'light');
    sunIcon.classList.toggle("active", theme === 'dark');
    moonIcon.classList.toggle("active", theme === 'light');
    taskInput.classList.toggle("light-task-background", theme === 'light');
    taskInput.style.color = theme === 'light' ? "var(--Very-Dark-Desaturated-Blue)" : "";
    taskContainer.classList.toggle("light-task-background", theme === 'light');
    buttonContainer.classList.toggle("light-task-background", theme === 'light');
    btnRight.classList.toggle('btn-hover-light', theme === 'light');
    info.style.color = theme === 'light' ? "var(--Dark-Grayish-Blue)" : "";
    inputLabel.classList.toggle('input-light', theme === 'light');
    shadow.classList.toggle('shadow-light', theme === 'light');

    checkboxLight.forEach(checkbox => {
        checkbox.classList.toggle("checkbox-light", theme === 'light');
    });

    taskField.forEach(task => {
        task.classList.toggle("light-border", theme === 'light');
    });

    btnMiddle.forEach(btn => {
        btn.classList.toggle("btn-middle-light", theme === 'light');
    });
}

const themeToggle =() => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

applyTheme(theme);

let taskData = JSON.parse(localStorage.getItem("taskData")) || [];

const addTask = () => {
    const taskTitle = taskInput.value.trim();
    if (taskTitle !== '') {
        const newTask = {
            id: Date.now(), 
            title: taskTitle,
            checked: false
        };
        taskData.push(newTask);
        saveTaskData();
        updateTaskContainer();
        taskInput.value = '';
    } else {
        alert('You must write something!');
    }
};

const createTaskElement = (task) => {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task');
    taskElement.setAttribute('draggable', 'true');
    taskElement.setAttribute('data-id', task.id.toString());

    const inputCheckBox = document.createElement('input');
    inputCheckBox.type = 'checkbox';
    inputCheckBox.name = `checkbox-${task.id}`;
    inputCheckBox.id = `checkbox-${task.id}`;
    inputCheckBox.classList.add('task-checkbox');
    inputCheckBox.checked = task.checked;

    const label = document.createElement('label');
    label.setAttribute('for', `checkbox-${task.id}`);
    label.classList.add('checkbox-label');
    label.textContent = task.title;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.setAttribute('data-id', task.id);

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/images/icon-cross.svg';
    deleteIcon.alt = 'delete icon';
    deleteIcon.classList.add('delete-icon');

    deleteButton.appendChild(deleteIcon);

    taskElement.appendChild(inputCheckBox);
    taskElement.appendChild(label);
    taskElement.appendChild(deleteButton);

    return taskElement;
};

const updateTaskContainer = () => {
    if (taskData.length === 0) {
        return;
    }

    const newTasks = taskData.map(task => createTaskElement(task));

    taskContainer.innerHTML = '';

    newTasks.forEach(taskElement => {
        taskContainer.appendChild(taskElement);
    });

    let deleteIcons = document.querySelectorAll('.delete-icon');
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const taskId = parseInt(event.target.parentElement.dataset.id);
            deleteTask(taskId);
        });
    });

    allBtn.style.color = 'var(--Bright-Blue)';
    activeBtn.style.color = '';
    completedBtn.style.color = '';
    applyTheme(theme);
};

const saveTaskData = () => {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach((checkbox) => {
        const taskId = parseInt(checkbox.id.split('-')[1]);
        const taskIndex = taskData.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            taskData[taskIndex].checked = checkbox.checked;
        }
    });
    localStorage.setItem("taskData", JSON.stringify(taskData));
};

const deleteTask = (taskId) => {
    taskData = taskData.filter(task => task.id !== taskId);

    saveTaskData();
    updateTaskContainer();
    showItemsCounter();

    if (taskData.length === 0) {
        taskContainer.innerHTML = '';
    }
};

const showItemsCounter = () => {
    const items = document.getElementById('items-counter');
    let counter = 0;
    taskData.forEach((check) => {
        if (!check.checked) {
            counter++;
        }
    });
    items.innerHTML = `${counter} items left`;
};


allBtn.addEventListener('click', () => {
    updateTaskContainer();
});

const renderTasks = (filterFunction, activeColor = '', allColor = '', completedColor = '') => {
    activeBtn.style.color = activeColor;
    allBtn.style.color = allColor;
    completedBtn.style.color = completedColor;

    const filteredTasks = taskData.filter(filterFunction);
    taskContainer.innerHTML = '';

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskContainer.appendChild(taskElement);
    });
};

activeBtn.addEventListener('click', () => {
    renderTasks(task => !task.checked, 'var(--Bright-Blue)', '', '');
    applyTheme(theme);
});

completedBtn.addEventListener('click', () => {
    renderTasks(task => task.checked, '', '', 'var(--Bright-Blue)');
    applyTheme(theme);
});

clearBtn.addEventListener('click', () => {
    taskData = taskData.filter(task => !task.checked);
    
    saveTaskData(); 
    updateTaskContainer(); 
    showItemsCounter(); 
    applyTheme(theme);

    if (taskData.length === 0) {
        taskContainer.innerHTML = '';
    }
});

toggleBtn.addEventListener("click", themeToggle);

window.addEventListener('DOMContentLoaded', () => {
    taskData = JSON.parse(localStorage.getItem("taskData")) || [];

    saveTaskData(); 
    updateTaskContainer(); 
    showItemsCounter(); 
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
        showItemsCounter();
        updateTaskContainer();
    }
});

taskContainer.addEventListener('change', (e) => {
    if (e.target && e.target.type === 'checkbox') {
        const taskId = parseInt(e.target.id.split('-')[1]);
        const taskIndex = taskData.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            taskData[taskIndex].checked = e.target.checked;
            localStorage.setItem("taskData", JSON.stringify(taskData));
            showItemsCounter(); 
        }
    }
});

let draggedItem = null;

taskContainer.addEventListener('dragstart', (e) => {
    draggedItem = e.target;
    draggedItem.classList.add('dragging');
    setTimeout(() => {
        e.target.style.display = 'none';
    }, 0);
});

taskContainer.addEventListener('dragend', (e) => {
    setTimeout(() => {
        e.target.style.display = '';
        draggedItem.classList.remove('dragging');
        draggedItem= null;

        const updatedTaskData = [];
        const tasks = taskContainer.querySelectorAll('.task');
        tasks.forEach((task, index) => {
            const taskId = parseInt(task.querySelector('.delete-btn').getAttribute('data-id'));
            const foundTask = taskData.find(item => item.id === taskId);
            if (foundTask) {
                foundTask.order = index;
                updatedTaskData.push(foundTask);
            }
        });

        localStorage.setItem('taskData', JSON.stringify(updatedTaskData));
    }, 0);
});

taskContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskContainer, e.clientY);
        const currentElement = document.querySelector(".dragging");
        if (afterElement == null) {
            taskContainer.appendChild(
                draggedItem
            )
        } else {
            taskContainer.insertBefore(
                draggedItem,
                afterElement
            )
        }
    });
 
const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)"),];
 
    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return {
                    offset: offset,
                    element: child,
                };
            } else {        
                return closest;
            }
        },
        {
            offset: Number.NEGATIVE_INFINITY,
        }
    ).element;
};

