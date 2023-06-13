const API_URL = 'https://64106f42be7258e14529c12f.mockapi.io'

const todoForm = document.querySelector('.todo-form') as HTMLFormElement
const todoInput = document.querySelector('.todo-input') as HTMLInputElement
const todoList = document.querySelector('.todo-list') as HTMLUListElement

// Call API
async function fetchTodos() {
  try {
    const response = await fetch(`${API_URL}/todos`)
    const todos = await response.json()
    const filters = document.querySelectorAll('.filters span')

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('span.active')?.classList.remove('active')
        btn.classList.add('active')
        filterTasks(btn.id)
      })
    })
    todos.forEach((todo: { value: string, completed: boolean }) => {
      displayTodoItem(todo)
      updateTaskCount()
    })
  } catch (error) {
    console.error('Error fetching todos:', error)
  }
}

//count
function updateTaskCount() {
  const countElement = document.querySelector('.count') as HTMLElement
  const taskCount = todoList.children.length
  console.log(taskCount)
  countElement.textContent = String(taskCount)
}

// filter complete task
function filterTasks(filter: string) {
  const taskItems = todoList.children
  for (let i = 0; i <= taskItems.length - 1; i++) {
    const taskItem = taskItems[i] as HTMLElement
    const completed = taskItem.getAttribute('checked') === 'true'
    const isMatched = filter === 'all' || (filter === 'pending' && !completed) || (filter === 'completed' && completed)

    taskItem.style.display = isMatched ? 'flex' : 'none'
  }
}

// Add
async function addTodo() {
  const todoName = todoInput.value
  if (todoName.trim() === '') {
    return
  }

  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: todoName, completed: 'false' })
    })
    const newTodo = await response.json()
    displayTodoItem(newTodo)
    updateTaskCount()
    filterTasks(document.querySelector('span.active')?.id || '')
  } catch (error) {
    console.error('Error adding todo:', error)
  }

  todoInput.value = ''
}

// Edit
async function editTodo(id: string, newName: string) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: newName })
    })
    if (response.ok) {
      const updatedTodo = await response.json()
      updateTodoItem(id, updatedTodo)
    }
  } catch (error) {
    console.error(`Error editing todo with ID ${id}:`, error)
  }
}

// Delete
async function deleteTodo(id: string) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      removeTodoItem(id)
    }
    updateTaskCount()
    filterTasks(document.querySelector('span.active')?.id || '')
  } catch (error) {
    console.error(`Error deleting todo with ID ${id}:`, error)
  }
}

// Toggle Completed
async function toggleCompleted(id: string, status: boolean) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: status ? 'true' : 'false' })
    })
    if (response.ok) {
      const updatedTodo = await response.json()
      updateTodoItem(id, updatedTodo)
    }
    filterTasks(document.querySelector('span.active')?.id || '')
  } catch (error) {
    console.error(`Error toggling completed for todo with ID ${id}:`, error)
  }
}

// Display a todo item
function displayTodoItem(todo: { id: string, value: string, completed: string }) {
  const todoItem = document.createElement('li')
  const todoNameTask = document.createElement('p')
  todoNameTask.textContent = todo.value
  if (todo.completed === 'true') {
    todoNameTask.classList.add('checked')
    todoItem.setAttribute('checked', 'true')
  }

  todoItem.setAttribute('data-id', todo.id)

  const setting = document.createElement('div')
  setting.className = 'settings'
  const editButton = document.createElement('button')
  editButton.textContent = 'Edit'
  editButton.addEventListener('click', () => {
    const newName = prompt('Enter the new name for the todo:', todo.value)
    if (newName !== null && newName.trim() !== '') {
      editTodo(todo.id, newName)
    }
  })
  setting.appendChild(editButton)

  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Delete'
  deleteButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.id)
    }
  })
  setting.appendChild(deleteButton)

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = todo.completed === 'true'
  checkbox.addEventListener('change', () => {
    toggleCompleted(todo.id, checkbox.checked)
  })

  todoItem.appendChild(checkbox)
  todoItem.appendChild(todoNameTask)
  todoItem.appendChild(setting)
  todoList.appendChild(todoItem)
}

// Update a todo item
function updateTodoItem(id: string, updatedTodo: { value: string, completed: string }) {
  const todoItem = todoList.querySelector(`li[data-id="${id}"]`) as HTMLLIElement
  if (todoItem) {
    todoItem.querySelector('p')!.textContent = updatedTodo.value
    todoItem.setAttribute('checked', SupdatedTodo.completed === 'true')
    todoItem.querySelector('input[type="checkbox"]')!.checked = updatedTodo.completed === 'true'
    todoItem.querySelector('p')!.classList.toggle('checked', updatedTodo.completed === 'true')
  }
}

// Remove a todo item
function removeTodoItem(id: string) {
  const todoItem = todoList.querySelector(`li[data-id="${id}"]`) as HTMLLIElement
  if (todoItem) {
    todoItem.remove()
  }
}

// Handle form submission
todoForm.addEventListener('submit', event => {
  event.preventDefault()
  addTodo()
})

const filters = document.querySelectorAll('.filters span')
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active')?.classList.remove('active')
    btn.classList.add('active')
    showTodo(btn.id)
  })
})

// Fetch todos when the page loads
fetchTodos()
updateTaskCount()
