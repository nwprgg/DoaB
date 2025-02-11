document.addEventListener("DOMContentLoaded", function() {
    const openDialogButton = document.getElementById("open-dialog-btn");
    const taskDialog = document.getElementById("task-dialog");
    const closeDialogButton = document.getElementById("close-dialog-btn");
    const submitTaskBtn = document.getElementById("submit-task-btn");
    const taskInput = document.getElementById("task-input");
    const tagInput = document.getElementById("tag-input");
    const todoColumn = document.getElementById("todo-column");
    const inProgressColumn = document.getElementById("in-progress-column");
    const doneColumn = document.getElementById("done-column");
    const filterInput = document.getElementById("filter-input");

    let isEditing = false;
    let editingTaskId = null; // Хранение индекса и статуса редактируемой задачи

    const tasksData = JSON.parse(localStorage.getItem("tasksData")) || {
        todo: [],
        inProgress: [],
        done: [],
    };

    function renderTasks(filterTag = "") {
        // Очистка содержимого колонок и восстановление заголовков
        todoColumn.innerHTML = '<h2>Задачи</h2>';
        inProgressColumn.innerHTML = '<h2>В процессе</h2>';
        doneColumn.innerHTML = '<h2>Выполнено</h2>';

        // Рендер задач для каждой категории
        Object.entries(tasksData).forEach(([status, tasks]) => {
            const column =
                status === "todo" ?
                todoColumn :
                status === "inProgress" ?
                inProgressColumn :
                doneColumn;

            tasks.forEach((task, id) => {
                if (filterTag === "" || task.tags.includes(filterTag)) {
                    createTaskElement(task, column, status, id);
                }
            });
        });
    }

    function createTaskElement(task, parentColumn, status, id) {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        if (status === "done") {
            taskItem.classList.add("completed");
        }

        taskItem.innerHTML = `
            <div class="task-row">
                <input type="checkbox" class="status-checkbox" ${
                    status === "done" ? "checked disabled" : ""
                }>
                <p class="task-content task-text">${task.text}</p>
            </div>
            <div class="task-tags">${task.tags.join(", ")}</div>
            <div class="task-actions">
                <button class="button edit-btn">Редактировать</button>
                <button class="button delete-btn">Удалить</button>
            </div>
        `;

        parentColumn.appendChild(taskItem);

        const statusCheckbox = taskItem.querySelector(".status-checkbox");
        const editBtn = taskItem.querySelector(".edit-btn");
        const deleteBtn = taskItem.querySelector(".delete-btn");

        statusCheckbox.addEventListener("change", () =>
            handleTaskStatusChange(task, status, id)
        );
        editBtn.addEventListener("click", () => handleTaskEdit(task, status, id));
        deleteBtn.addEventListener("click", () => handleTaskDelete(status, id));
    }

    function handleTaskStatusChange(task, currentStatus, id) {
        let newStatus;
        if (currentStatus === "todo") {
            newStatus = "inProgress";
        } else if (currentStatus === "inProgress") {
            newStatus = "done";
        } else {
            return; // Задача уже выполнена
        }

        // Перемещаем задачу между статусами
        tasksData[currentStatus].splice(id, 1);
        tasksData[newStatus].push(task);

        // Сохраняем изменения
        localStorage.setItem("tasksData", JSON.stringify(tasksData));
        renderTasks();
    }

    function handleTaskEdit(task, status, id) {
        isEditing = true; // Активируем режим редактирования
        editingTaskId = { status, id }; // Сохраняем статус и индекс редактируемой задачи

        taskInput.value = task.text;
        tagInput.value = task.tags.join(", ");
        taskDialog.showModal();
    }

    function handleTaskDelete(status, id) {
        tasksData[status].splice(id, 1);
        localStorage.setItem("tasksData", JSON.stringify(tasksData));
        renderTasks();
    }

    function handleTaskSave() {
        const taskText = taskInput.value.trim();
        const tags = tagInput.value
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);

        if (!taskText) {
            console.error("Задача не может быть пустой.");
            return;
        }

        if (isEditing && editingTaskId !== null) {
            // Обновляем существующую задачу
            const { status, id } = editingTaskId;
            tasksData[status][id] = { text: taskText, tags: tags };
        } else {
            // Добавляем новую задачу
            tasksData.todo.push({ text: taskText, tags: tags });
        }

        // Сохраняем изменения
        localStorage.setItem("tasksData", JSON.stringify(tasksData));
        renderTasks();

        resetEditingState();
        taskDialog.close();
    }

    function resetEditingState() {
        isEditing = false;
        editingTaskId = null;

        taskInput.value = "";
        tagInput.value = "";
    }

    openDialogButton.addEventListener("click", () => {
        resetEditingState();
        taskDialog.showModal();
    });

    closeDialogButton.addEventListener("click", () => {
        taskDialog.close();
    });

    submitTaskBtn.addEventListener("click", handleTaskSave);

    filterInput.addEventListener("input", (event) => {
        const filterTag = event.target.value.trim();
        renderTasks(filterTag);
    });

    renderTasks();
});