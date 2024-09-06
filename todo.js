document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todosContainer = document.getElementById('todos-container');

    let todos = [];
    let editTodo = null;

    function renderTodos() {
        todosContainer.innerHTML = '';
        todos.forEach((todo, index) => {
            const todoRow = document.createElement('div');
            todoRow.className = `todo-row ${todo.isComplete ? 'complete' : ''}`;
            todoRow.innerHTML = `
                <div class="todo-text">${todo.text}</div>
                <div class="icons">
                    <span class="delete-icon" data-index="${index}">&#10006;</span>
                    <span class="edit-icon" data-index="${index}">&#9998;</span>
                </div>
            `;
            todosContainer.appendChild(todoRow);
        });

        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeTodoHandler(index);
            });
        });

        document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                editTodoHandler(index);
            });
        });

        document.querySelectorAll('.todo-text').forEach(text => {
            text.addEventListener('click', (e) => {
                const index = e.target.parentElement.querySelector('.delete-icon').getAttribute('data-index');
                completeTodoHandler(index);
            });
        });
    }

    function addTodoHandler(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (!text) return;
        if (editTodo !== null) {
            todos[editTodo].text = text;
            editTodo = null;
        } else {
            todos.push({ text, isComplete: false });
        }
        todoInput.value = '';
        renderTodos();
    }

    function removeTodoHandler(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    function completeTodoHandler(index) {
        todos[index].isComplete = !todos[index].isComplete;
        renderTodos();
    }

    function editTodoHandler(index) {
        todoInput.value = todos[index].text;
        editTodo = index;
    }

    todoForm.addEventListener('submit', addTodoHandler);
    renderTodos();
});
