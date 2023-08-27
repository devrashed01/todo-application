var todoListArray = [];
initApp();
tabHandler();
initUpdateTodoListener();

function initApp() {
  console.log("initializing App....");
  var todoList = document.getElementById("todoList");
  var todoForm = document.getElementById("todoForm");
  var todoCompleteClear = document.getElementById("todoCompleteClear");

  initTodoList();

  todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const currentTab = window.location.hash;
    const id = todoListArray.length;
    const value = e.target.elements.todoInput.value;
    var todoItem = document.createElement("div");
    todoItem.classList.add("todo");
    const newTodo = { id, value, completed: false };
    todoItem.innerHTML = generateTodoItem(newTodo);

    if (currentTab !== "#completed") {
      todoList.prepend(todoItem);
    }

    todoListArray.unshift(newTodo);
    localStorage.setItem("todoListArray", JSON.stringify(todoListArray));
    e.target.elements.todoInput.value = "";
    updateWhatLefts();
    initUpdateTodoListener();
  });

  todoCompleteClear.addEventListener("click", function () {
    todoListArray = todoListArray.filter((item) => !item.completed);
    localStorage.setItem("todoListArray", JSON.stringify(todoListArray));
    updateWhatLefts();
    initTodoList();
  });
}

function initTodoList(tab) {
  const currentTab = tab ?? window.location.hash ?? "#all";
  console.log("initializing todo list....");
  var todoList = document.getElementById("todoList");

  invalidateTodoListArray();
  updateWhatLefts();

  todoList.innerHTML = "";
  if (todoListArray?.length) {
    for (var i = 0; i < todoListArray.length; i++) {
      const row = todoListArray[i];
      if (currentTab === "#completed" && !row.completed) continue;
      if (currentTab === "#active" && row.completed) continue;

      var todoItem = document.createElement("div");
      todoItem.classList.add("todo");
      if (row.completed) {
        todoItem.classList.add("completed");
      }
      todoItem.innerHTML = generateTodoItem(row);

      todoList.appendChild(todoItem);
    }
  }
}

function invalidateTodoListArray() {
  var todoListArrayString = localStorage.getItem("todoListArray");
  if (todoListArrayString != null) {
    todoListArray = JSON.parse(todoListArrayString);
  }
}
function updateWhatLefts() {
  var whatLefts = document.getElementById("whatLefts");
  var whatLeftsCount =
    todoListArray.filter((item) => !item.completed).length ?? 0;

  if (whatLeftsCount === 0) {
    whatLefts.innerHTML = "No items left";
    return;
  }
  whatLefts.innerHTML =
    whatLeftsCount > 1
      ? `${whatLeftsCount} items left`
      : `${whatLeftsCount} item left`;
}

function generateTodoItem({ id, value, completed }) {
  return `<div class="todo__checkbox">
            <input ${
              completed ? "checked" : ""
            } onchange="todoStatusHandler({id:${id},completed: ${completed}})" id="${id}" type="checkbox">
            <label for="${id}" />
          </div>
          <form class="todoTextForm">
          <input id="${id}" name="todo" value="${value}" />
          </form>
          <button onclick="deleteHandler({id:${id},completed: ${completed}})"><img src="assets/images/delete.svg" alt="Delete"></button>`;
}

function todoStatusHandler(e) {
  todoListArray.map((item) => {
    if (item.id === e.id) {
      item.completed = !item.completed;
    }
  });
  localStorage.setItem("todoListArray", JSON.stringify(todoListArray));

  var todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  initTodoList();
}

function deleteHandler(e) {
  const newTodoList = todoListArray.filter((item) => item.id !== e.id);
  localStorage.setItem("todoListArray", JSON.stringify(newTodoList));

  initTodoList();
}

function tabHandler() {
  const tabButton = document.querySelectorAll("a.btn");

  tabButton.forEach((button) => {
    // add active
    const currentTab = window.location.hash ?? "#all";
    if (button.hash === currentTab) {
      button.classList.add("btn-primary");
      button.classList.remove("btn-default");
    }
    button.addEventListener("click", function (e) {
      tabButton.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-default");
      });
      e.target.classList.add("btn-primary");
      e.target.classList.remove("btn-default");
      initTodoList(e.target.hash);
    });
  });
}

function initUpdateTodoListener() {
  var todoTextForms = document.querySelectorAll(".todoTextForm");
  todoTextForms.forEach((form) => {
    form.removeEventListener("submit", updateTodo);
    form.addEventListener("submit", updateTodo);
  });
}

function updateTodo(event) {
  event.preventDefault();
  const { id, value } = event.target.todo;
  todoListArray.map((item) => {
    if (item.id === Number(id)) {
      item.value = value;
    }
  });
  localStorage.setItem("todoListArray", JSON.stringify(todoListArray));
  event.target.todo.blur();
}
