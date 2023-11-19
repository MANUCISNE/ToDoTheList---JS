const todos = []

window.addEventListener('load', () => {
	const dadosSalvos = JSON.parse(localStorage.getItem('todos'));

	dadosSalvos.forEach(a=>todos.push(a));
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', e =>
		localStorage.setItem('username', e.target.value)
	)

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();
		if(!e.target.elements.content.value.trim()) return

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the form
		e.target.reset();

		DisplayTodos()
	})

	DisplayTodos()
})

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
				'input',
				[
					{ attribute: 'type', value: 'text' },
					{ attribute: 'value', value: todo.content },
					{ attribute: 'readonly', value: '' },

				],

			)]
		)
		const editButton = CreateElementSetAttribute('button',
			[
				{ attribute: 'class', value: 'edit' },
				// { attribute: 'onclick', value: editFunction(content, todo) },
			],
			['edit']
		)
		const deleteButton = CreateElementSetAttribute('button',
			[
				{ attribute: 'class', value: 'delete' },
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
		editButton.addEventListener('click', () => editFunction(content, todo))
		deleteButton.addEventListener('click', () => deleteButtonClick(todo))
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

function editFunction(content, todo) {
	const input = content.querySelector('input');
	input.removeAttribute('readonly');
	input.focus();
	input.addEventListener('blur', (e) => {
		input.setAttribute('readonly', true);
		todo.content = e.target.value;
		localStorage.setItem('todos', JSON.stringify(todos));
		DisplayTodos()

	})
}

function deleteButtonClick(todo) {
	const itemFiltrado = todos.findIndex(t => t == todo)
	todos.splice(itemFiltrado, 1)
	// todos = todos.filter(t => t != todo);
	localStorage.setItem('todos', JSON.stringify(todos));
	DisplayTodos()

}

/**
 * 
 */
function CreateElementSetAttribute(element, attributeList = [], content = []) {
	if (!element) return
	const htmlElement = document.createElement(element)

	if (content.length) content.forEach(a => {
		if (typeof a == 'string') htmlElement.innerHTML = a
		else htmlElement.append(a)
	})

	if (attributeList.length) attributeList.forEach(a =>
		htmlElement.setAttribute(a.attribute, a.value))

	return htmlElement
}