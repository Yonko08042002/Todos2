const API_URL = 'https://64106f42be7258e14529c12f.mockapi.io';

const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');

// call API
async function fetchTodos() {
  try {
    const response = await fetch(`${API_URL}/todos`);
    const todos = await response.json();
    todos.forEach(todo => {
      displayTodoItem(todo);
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

// thêm
async function addTodo() {
  const todoName = todoInput.value;
  if (todoName.trim() === '') {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: todoName }),
    });
    const newTodo = await response.json();
    displayTodoItem(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
  }

  todoInput.value = '';
}

// sửa
async function editTodo(id, newName) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: newName }),
    });
    if (response.ok) {
      const updatedTodo = await response.json();
      updateTodoItem(id, updatedTodo);
      
    }
  } catch (error) {
    console.error(`Error editing todo with ID ${id}:`, error);
  }
}

// xóa
async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      removeTodoItem(id);
    }
  } catch (error) {
    console.error(`Error deleting todo with ID ${id}:`, error);
  }
}

// Display a todo item
function displayTodoItem(todo) {
    const todoItem = document.createElement('li');
    const todoNameTask = document.createElement('p');
    todoNameTask.textContent = todo.value;
    if (todo.status === 'completed') {
      todoNameTask.classList.add('completed');
    }
    const setting = document.createElement('div');
    setting.className='settings';
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      const newName = prompt('Enter the new name for the todo:', todo.value);
      if (newName !== null && newName.trim() !== '') {
        editTodo(todo.id, newName);
      }
    });
    setting.appendChild(editButton);
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this todo?')) {
        deleteTodo(todo.id);
      }
    });
    setting.appendChild(deleteButton);
    todoItem.appendChild(todoNameTask);
    todoItem.appendChild(setting)
    todoList.appendChild(todoItem);
  }

// Update a todo item
function updateTodoItem(id, updatedTodo) {
  const todoItem = todoList.querySelector(`li[data-id="${id}"]`);
  if (todoItem) {
    todoItem.textContent = updatedTodo.value;
  }
}

// Remove a todo item
function removeTodoItem(id) {
  const todoItem = todoList.querySelector(`li[data-id="${id}"]`);
  if (todoItem) {
    todoItem.remove();
  }
}

// Handle form submission
todoForm.addEventListener('submit', event => {
  event.preventDefault();
  addTodo();
});



// Fetch todos when the page loads
fetchTodos();