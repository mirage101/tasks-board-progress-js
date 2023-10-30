document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const todoPanel = document.getElementById("todo-panel");
  const doingPanel = document.getElementById("doing-panel");
  const donePanel = document.getElementById("done-panel");
  const closeEl = "<span class='close'></span>";

  var existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function loadTasks() {
    console.log("Loading tasks");
    existingTasks.forEach((task) => {
      console.log(task);
      const taskElement = createTaskElement(task.title, task.id);
      if (task.status === "todo") {
        todoPanel.appendChild(taskElement);
      } else if (task.status === "doing") {
        doingPanel.appendChild(taskElement);
      } else if (task.status === "done") {
        donePanel.appendChild(taskElement);
      }
    });

    // Update the event listener for the close button after loading tasks
    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener("click", deleteTask);
    });
  }

  function createTaskElement(title, taskId) {
    const taskElement = document.createElement("p");
    taskElement.classList.add("task");
    taskElement.setAttribute("draggable", "true");
    taskElement.innerText = title;
    const closeEl = document.createElement("span");
    closeEl.classList.add("close");
    closeEl.innerText = "X";
    taskElement.appendChild(closeEl);

    taskElement.addEventListener("dragstart", (e) => {
      taskElement.classList.add("is-dragging");
    });

    taskElement.addEventListener("dragend", (e) => {
      taskElement.classList.remove("is-dragging");
      const newStatus = e.target.parentElement.getAttribute("data-panel");
      console.log(newStatus);
      updateTaskStatus(taskId, newStatus);
    });

    taskElement.dataset.id = taskId;
    return taskElement;
  }

  function updateTaskStatus(taskId, newStatus) {
    const taskToUpdate = existingTasks.find((task) => task.id == taskId);
    if (taskToUpdate) {
      taskToUpdate.status = newStatus;
      localStorage.setItem("tasks", JSON.stringify(existingTasks));
    }
  }

  function deleteTask() {
    const taskId = this.parentElement.dataset.id;
    const taskIndex = existingTasks.findIndex((task) => task.id == taskId);

    if (taskIndex !== -1) {
      existingTasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(existingTasks));

      // Remove the task from the DOM
      this.parentElement.remove();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    const taskData = {
      id: new Date().getTime(),
      title: value,
      status: "todo",
    };
    console.log(taskData);

    const taskElement = createTaskElement(taskData.title, taskData.id);

    todoPanel.appendChild(taskElement);
    input.value = "";

    existingTasks.push(taskData);
    localStorage.setItem("tasks", JSON.stringify(existingTasks));
  });

  // Call loadTasks on page load
  loadTasks();
});
