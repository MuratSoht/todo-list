let todoArray = [];

let createAppTitle = (title) => {
    const appTitle = document.createElement('h1');
    appTitle.innerHTML = title;

    return appTitle;
}

let createTodoForm = () => {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let addButton = document.createElement('button');
    let wrapper = document.createElement('div');

    addButton.disabled = !input.value.length;

    input.addEventListener('input', () => {
        addButton.disabled = !input.value.length;
    });

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название дела';
    addButton.classList.add('btn', 'btn-primary');
    wrapper.classList.add('input-group-append');
    addButton.textContent = 'Добавит дело';

    wrapper.append(addButton);
    form.append(input);
    form.append(wrapper);

    return {
        form,
        input,
        addButton
    }
}

let createTodoList = () => {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

let createTodoItem = (name) => {
    let todoItem = document.createElement('li');
    let btnWrapper = document.createElement('div');
    let doneBtn = document.createElement('button');
    let deleteBtn = document.createElement('button');

    let randomId = Math.random() * 15.75;
    todoItem.id = randomId.toFixed(2);

    todoItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    doneBtn.classList.add('btn', 'btn-success');
    deleteBtn.classList.add('btn', 'btn-danger');
    btnWrapper.classList.add('button-div')
    todoItem.textContent = name;
    doneBtn.textContent = 'Готово';
    deleteBtn.textContent = 'Удалить';

    btnWrapper.append(doneBtn, deleteBtn);
    todoItem.append(btnWrapper);

    return {
        todoItem,
        doneBtn,
        deleteBtn,
        btnWrapper
    }
}

let changeItemDone = (arr, item) => {
    arr.map(obj => {
        if (obj.id === item.id & obj.done === false) {
            obj.done = true;
        } else if (obj.id === item.id & obj.done === true) {
            obj.done = false;
        }
    });
}

let completeTodoItem = (item, btn) => {
    btn.addEventListener('click', () => {
        todoArray = JSON.parse(localStorage.getItem(key));
        item.classList.toggle('list-group-item-success');
        changeItemDone(todoArray, item);

        localStorage.setItem(key, JSON.stringify(todoArray));
    });
}

let deleteTodoItem = (item, btn) => {
    btn.addEventListener('click', () => {
        if (confirm('Вы уверены?')) {
            todoArray = JSON.parse(localStorage.getItem(key));

            let neaList = todoArray.filter(obj => obj.id !== item.id);

            localStorage.setItem(key, JSON.stringify(neaList));
            item.remove();
        }
    });
}

function createTodoApp(container, title, key) {
    let appTitle = createAppTitle(title);
    let appForm = createTodoForm();
    let appList = createTodoList();

    container.append(appTitle, appForm.form, appList);

    if (localStorage.getItem(key)) {
        todoArray = JSON.parse(localStorage.getItem(key));

        for (let obj of todoArray) {
            let todoItem = createTodoItem(appForm.input.value);

            todoItem.todoItem.textContent = obj.name;
            todoItem.todoItem.id = obj.id;

            if (obj.done == true) {
                todoItem.todoItem.classList.add('list-group-item-success');
            } else {
                todoItem.todoItem.classList.remove('list-group-item-success');
            }

            completeTodoItem(todoItem.todoItem, todoItem.doneBtn);
            deleteTodoItem(todoItem.todoItem, todoItem.deleteBtn);

            appList.append(todoItem.todoItem);
            todoItem.todoItem.append(todoItem.btnWrapper);
        }
    }

    appForm.form.addEventListener('submit', e => {
        e.preventDefault();

        let todoItem = createTodoItem(appForm.input.value);

        if (!appForm.input.value) {
            return;
        }
        completeTodoItem(todoItem.todoItem, todoItem.doneBtn);
        deleteTodoItem(todoItem.todoItem, todoItem.deleteBtn);

        let localStorageData = localStorage.getItem(key);

        if (localStorageData == null) {
            todoArray = [];
        } else {
            todoArray = JSON.parse(localStorageData);
        }

        let createItemObj = (arr) => {
            let itemObj = {};
            itemObj.name = appForm.input.value;
            itemObj.id = todoItem.todoItem.id;
            itemObj.done = false;

            arr.push(itemObj);
        }
        createItemObj(todoArray);
        localStorage.setItem(key, JSON.stringify(todoArray));

        appList.append(todoItem.todoItem);
        appForm.input.value = '';
        appForm.addButton.disabled = !appForm.addButton.disabled;
    });
}
