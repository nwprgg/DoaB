document.addEventListener("DOMContentLoaded", () => {
    const taskDialog = document.getElementById("task-dialog");
    const taskInput = document.getElementById("task-input");
    const submitTaskBtn = document.getElementById("submit-task-btn");
    const closeDialogBtn = document.getElementById("close-dialog-btn");

    let editingTaskElement = null; // Переменная для хранения редактируемой задачи

    // Открытие модального окна для редактирования задачи
    function openEditDialog(taskElement) {
        editingTaskElement = taskElement;
        taskInput.value = taskElement.querySelector(".task-text").innerText; // Загружаем текст задачи
        taskDialog.showModal();
    }

    // Сохранение изменений задачи
    submitTaskBtn.addEventListener("click", () => {
        if (editingTaskElement) {
            const newTaskText = taskInput.value.trim();
            if (newTaskText) {
                editingTaskElement.querySelector(".task-text").innerText = newTaskText; // Обновляем текст задачи
            }
        }
        editingTaskElement = null;
        taskDialog.close();
    });

    // Закрытие модального окна
    closeDialogBtn.addEventListener("click", () => {
        editingTaskElement = null;
        taskDialog.close();
    });

    // Функция добавления задачи в колонку
    function addTaskToColumn(columnId, taskText) {
        const column = document.getElementById(columnId);
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-item");
        taskElement.innerHTML = `
            <p class="task-text">${taskText}</p>
            <button class="edit-task-btn">Редактировать</button>
            <button class="delete-task-btn">Удалить</button>
        `;

        // Кнопка "Редактировать"
        const editBtn = taskElement.querySelector(".edit-task-btn");
        editBtn.addEventListener("click", () => openEditDialog(taskElement));

        // Кнопка "Удалить"
        const deleteBtn = taskElement.querySelector(".delete-task-btn");
        deleteBtn.addEventListener("click", () => taskElement.remove());

        column.appendChild(taskElement);
    }

    // Пример использования: Слушатель для кнопки "Добавить задачу"
    const addTaskBtn = document.getElementById("open-dialog-btn");
    addTaskBtn.addEventListener("click", () => {
        editingTaskElement = null;
        taskInput.value = ""; // Очищаем поле ввода
        taskDialog.showModal();
    });
});