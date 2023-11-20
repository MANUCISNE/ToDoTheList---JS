const todos = []

const nameInput = document.querySelector('#name');
const newTodoForm = document.querySelector('#new-todo-form');
const username = localStorage.getItem('username') || '';


window.addEventListener('load', () => {
	const dadosSalvos = JSON.parse(localStorage.getItem('todos'));

	dadosSalvos.forEach(a => todos.push(a));

	nameInput.value = username;

	DisplayTodos()
})

function resetForm() {
	newTodoForm.content.value = ''
	newTodoForm.idForm.value = null
	newTodoForm.category.value = 'business'
	newTodoForm.submit.value = 'ADD TODO'
}

function DisplayTodos() {
	const todoList = document.getElementById('todo-list');
	todoList.innerHTML = "";

	todos.forEach(todo => {

		//#region Criando elementos Html

		const todoItem = CreateElementSetAttribute('div',
			[{ attribute: 'class', value: 'todo-item' }]
		)
		const label = CreateElementSetAttribute('label');
		const input = CreateElementSetAttribute(
			'input',
			[
				{ attribute: 'type', value: 'checkbox' },
				{ attribute: 'checked', value: todo.done },
			]
		)
		const span = CreateElementSetAttribute(
			'span',
			[
				{ attribute: 'class', value: `bubble ${todo.category}` }
			],
		)
		const content = CreateElementSetAttribute(
			'div',
			[{ attribute: 'class', value: 'todo-content' }],
			[CreateElementSetAttribute(
				'span',
				null,
				[
					todo.content
				]

			)]
		)
		const editButton = CreateElementSetAttribute('button',
			[
				{ attribute: 'class', value: 'edit' },
				{ attribute: 'id', value: todo.id },

			],
			['edit']
		)
		const deleteButton = CreateElementSetAttribute('button',
			[
				{ attribute: 'class', value: 'delete' },
				{ attribute: 'id', value: todo.id },
			],
			['Delete']
		)
		const actions = CreateElementSetAttribute(
			'div',
			[{ attribute: 'class', value: 'actions' }],
			[
				editButton,
				deleteButton
			]
		)

		if (todo.done) todoItem.classList.add('done');
		input.checked = todo.done;
		//#endregion


		content.append(label, span, input)
		label.append(input, span);
		todoItem.append(label, content, actions);
		todoList.append(todoItem);


		input.addEventListener('change', (e) => changeStatus(e, todo, todoItem))
		editButton.addEventListener('click', () => editFunction(todo.id))
		deleteButton.addEventListener('click', () => deleteButtonClick(todo.id))
	})

}

function changeStatus(e, todo, todoItem) {
	todo.done = e.target.checked;
	localStorage.setItem('todos', JSON.stringify(todos));

	if (todo.done) {
		todoItem.classList.add('done');
	} else {
		todoItem.classList.remove('done');
	}

	DisplayTodos()
}

function editFunction(id) {
	const itemFiltrado = todos.findIndex(t => t.id == id)

	newTodoForm.content.value = todos[itemFiltrado].content
	newTodoForm.category.value = todos[itemFiltrado].category
	newTodoForm.idForm.value = todos[itemFiltrado].id
	newTodoForm.submit.value = 'SAVE EDIT'
}

function deleteButtonClick(id) {
	const itemFiltrado = todos.findIndex(t => t.id == id)
	todos.splice(itemFiltrado, 1)

	localStorage.setItem('todos', JSON.stringify(todos));

	DisplayTodos()
}

newTodoForm.addEventListener('submit', e => {
	e.preventDefault();
	if (!e.target.elements.content.value.trim()) return

	const id = todos.length > 0 ? todos.map(a => a.id).sort((a, b) => a - b)[0] + 1 : 1
	const idInput = document.querySelector('input[name="id"]')


	if (!idInput.value) {
		todos.push({
			id,
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		})
	} else {
		const rebuild = todos.findIndex(obj => obj.id == idInput.value)

		todos[rebuild].category = e.target.elements.category.value
		todos[rebuild].content = e.target.elements.content.value
	}


	localStorage.setItem('todos', JSON.stringify(todos));

	// Reset the form
	e.target.reset();

	DisplayTodos()
	newTodoForm.submit.value = 'ADD TODO'
})

nameInput.addEventListener('change', e =>
	localStorage.setItem('username', e.target.value)
)

/**
 * 
 */
function CreateElementSetAttribute(element, attributeList = [], content = []) {
	if (!element) return
	const htmlElement = document.createElement(element)

	if (content?.length) content.forEach(a => {
		if (typeof a == 'string') htmlElement.innerHTML = a
		else htmlElement.append(a)
	})

	if (attributeList?.length) attributeList.forEach(a =>
		htmlElement.setAttribute(a.attribute, a.value))

	return htmlElement
}