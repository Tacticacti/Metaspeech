import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import sut from './+page.svelte';

it('displays the currency with a $ in front of it', () => {
	const { getByTestId } = render(sut, { currency: 20 });

	expect(getByTestId('formatted-currency').innerHTML).toEqual('$20.00');
});

it('displays the default value of currency', () => {
	const { getByTestId, getByPlaceholderText } = render(sut);

	expect(getByTestId('formatted-currency').innerHTML).toEqual('$0.00');

	expect(getByPlaceholderText('input number').innerHTML).toEqual('');
});

it('displays the default value of currency after input has changed', async () => {
	const user = userEvent.setup();

	const { getByPlaceholderText, getByTestId } = render(sut);

	const formatted = getByTestId('formatted-currency');
	const input = getByPlaceholderText('input number');
	user.clear(input);
	await user.type(input, '50');

	expect(formatted.innerHTML).toEqual('$50.00');
});

it('displays the main heading', () => {
	const { getByRole } = render(sut, { currency: 10 });

	const text = 'Only meant to be used as example for testing purposes';
	const heading = getByRole('heading', { name: text });

	expect(heading).to.exist;
});

it('displays the h3 heading', () => {
	const { getByRole } = render(sut, { currency: 2 });

	const text = 'Either run "npm test" or "npm run test:unit" to unit test';
	const heading = getByRole('heading', { name: text, level: 3 });

	expect(heading).to.exist;
});

it('counter starts at 0', () => {
	const { getByTestId } = render(sut);

	const counter = getByTestId('counter');
	const doubled = getByTestId('doubled');

	expect(counter.innerHTML).toContain('0');
	expect(doubled.innerHTML).toContain('0');
});

it('counter starts at 0', async () => {
	const user = userEvent.setup();

	const { getByTestId } = render(sut);

	const counter = getByTestId('counter');
	const doubled = getByTestId('doubled');
	const button = getByTestId('inc-counter');

	await user.click(button);

	expect(counter.innerHTML).toContain('1');
	expect(doubled.innerHTML).toContain('2');
});

it('todo gets added to list', async () => {
	const user = userEvent.setup();

	const { getByText, getByTestId } = render(sut);

	const input = getByTestId('todo-input');
	await user.clear(input);
	await user.type(input, 'todo-1');

	const button = getByTestId('todo-button');
	await user.click(button);

	const todo = getByText('todo-1');

	expect(todo).to.exist;
});

it('size of ul is correct', async () => {
	const user = userEvent.setup();

	const { getByTestId } = render(sut);

	const ul = getByTestId('todo-ul');

	// first check size is 0
	expect(ul.childNodes.length).toBe(0);

	const input = getByTestId('todo-input');
	await user.clear(input);
	await user.type(input, 'todo-1');

	const button = getByTestId('todo-button');
	await user.click(button);

	// then check if size is 1
	expect(ul.childNodes.length).toBe(1);

	await user.clear(input);
	await user.click(button);

	// then check if size is 2
	expect(ul.childNodes.length).toBe(2);
});

it('li exists', async () => {
	const user = userEvent.setup();

	const { getByTestId, getAllByText } = render(sut);

	const input = getByTestId('todo-input');
	await user.clear(input);
	await user.type(input, 'todo-1');

	const button = getByTestId('todo-button');
	await user.click(button);

	await user.type(input, 'todo-1');
	await user.click(button);

	const li = getAllByText('todo-1');

	expect(li.length).toBe(2);
	expect(li[0].tagName).toBe('LI');
});

it('no li exists', () => {
	const { container } = render(sut);

	// Find all li elements
	const liElements = container.querySelectorAll('li');

	// Expect that there are no li elements
	expect(liElements.length).toBe(0);
});

it('should clear input field after adding a todo', async () => {
	const { getByTestId } = render(sut);

	const input = getByTestId('todo-input');
	const button = getByTestId('todo-button');

	await userEvent.type(input, 'New Todo');
	await userEvent.click(button);

	expect(input.innerHTML).toBe('');
});

it('should display all added todos', async () => {
	// Render the component
	const { getByTestId, getByText } = render(sut);

	// Get input field and button
	const input = getByTestId('todo-input');
	const button = getByTestId('todo-button');

	// Add multiple todos
	await userEvent.type(input, 'Todo 1');
	await userEvent.click(button);
	await userEvent.type(input, 'Todo 2');
	await userEvent.click(button);
	await userEvent.type(input, 'Todo 3');
	await userEvent.click(button);

	// Check if all todos are displayed
	expect(getByText('Todo 1')).to.exist;
	expect(getByText('Todo 2')).to.exist;
	expect(getByText('Todo 3')).to.exist;
});
