// select elements
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todoListElemt = document.getElementById("todos-list");
const notificationElemt = document.querySelector(".notification");

// variables
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editTodoId = -1;

// first render
renderTodos();

// form submit
form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    saveTodo();
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
})

// save todo
function saveTodo() {
    const todoValue = todoInput.value;
    
    // check if the todo is empty
    const isEmpty = todoValue === '';
    
    // check for duplicate todos
    const isDuplicate = todos.some((todo) => todo.value.toLowerCase() === todoValue.toLowerCase());
    
    if(isEmpty) {
        showNotification("Todo's value is empty!");
    } else if(isDuplicate) {
        showNotification("That Todo already exists!");
    } else {
        if (editTodoId >= 0) {
            // update the editTodo
            todos = todos.map((todo, index) => ({
                ...todo,
                value: index === editTodoId ? todoValue : todo.value,
            }));
            editTodoId = -1;
        } else {
            todos.push({
                value: todoValue,
                checked: false,
                color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()
            });
        }        

        todoInput.value = ''; 
    }
}

// render todos
function renderTodos() {
    if (todos.lenght === 0) {
        todoListElemt.innerHTML = '<center>Nothing to do!</center>';
        return;
    }

    // clear the element before a re-render
    todoListElemt.innerHTML = "";

    // to render todos
    todos.forEach((todo, index) => {
        todoListElemt.innerHTML += `
        <div class="todo" id=${index}>
            <i 
                class="bi ${todo.checked ? `bi-check-circle-fill` : `bi-circle`}" 
                style="color : ${todo.color}"
                data-action="check">
            </i>
            <p class="${todo.checked ? `checked` : ``}" data-action="check">${todo.value}</p>
            <i class="bi bi-pencil-square" data-action="edit"></i>
            <i class="bi bi-trash" data-action="delete"></i>
        </div>`;
    });
}

// click event listener for all the todos
todoListElemt.addEventListener('click', (event) => {
    const target = event.target;
    const parentElemt = target.parentNode;

    if(parentElemt.className !== 'todo')
    return;

    // todo id
    const todo = parentElemt;
    const todoId = Number(todo.id);

    // target action
    const action = target.dataset.action

    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);
});

//  check todo
function checkTodo(todoId) {
    todos = todos.map((todo, index) => ({
        ...todo,
        checked: index === todoId ? !todo.checked : todo.checked,
    }));
        
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}

//  edit a todo
function editTodo(todoId) {
    todoInput.value = todos[todoId].value;
    editTodoId = todoId;
}
 
// delete todo
function deleteTodo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    editTodoId = -1;

    // re-render
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}

// show Notifications
function showNotification(msg) {
    // change the message
    notificationElemt.innerHTML = msg;

    // notification enter
    notificationElemt.classList.add('notif-enter');

    // notification leave
    setTimeout(() => {
        notificationElemt.classList.remove('notif-enter');
    }, 2000); 
}