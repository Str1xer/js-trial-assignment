// Добавление задачи
const handleAddTask = () => {
    if (!inputForm.value)
        return

    tasks.push({ id: Date.now(), title: inputForm.value, completed: "" }) // В качестве ID будем использоваться timestamp. completed - также после выполнения будет установленно на время завершения
    insertTask(tasks.at(-1).id, inputForm.value, false)
    inputForm.value = ""
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// Вставка задачи в лист
const insertTask = (id, value, completed) => {
    const element = document.createElement('div')
    element.setAttribute("key", `${id}`)

    if (completed) {
        element.classList = "task completed"
        element.innerHTML = `<div class="task-text">${value}</div><div class="buttons"><button onclick="handleRemoveSelected(this, ${id})" class="remove-button">Удалить</button></div>`
        taskList.appendChild(element)
    } else {
        element.classList = "task"
        element.innerHTML = `<div class="task-text">${value}</div><div class="buttons"><button onclick="handleComplete(this, ${id})" class="complete-button">Complete</button><button onclick="handleRemoveSelected(this, ${id})" class="remove-button">Удалить</button></div>`
        taskList.insertBefore(element, document.querySelector(".completed")) // Если существуют завершенные задачи, то будем вставлять их перед первым выполненым элементом
    }
}

// Изменить/обновить стили на основе активных кнопок
const changeStylesheet = () => {
    if (oddActive && evenActive)
        return styleSheet.innerText = `.task:nth-child(even) { outline: 2px solid sandybrown} .task:nth-child(odd) { outline: 2px solid sandybrown}`
    if (oddActive)
        return styleSheet.innerText = `.task:nth-child(odd) { outline: 2px solid sandybrown}`
    if (evenActive)
        return styleSheet.innerText = `.task:nth-child(even) { outline: 2px solid sandybrown}`
    styleSheet.innerText = ``
}

// Выделить нечетные задачи
const handleSelectEven = (e) => {
    oddActive = !oddActive
    if (oddActive)
        e.classList.add("sub-button-active")
    else
        e.classList.remove("sub-button-active")
    changeStylesheet()
}

// Выделить четные задачи
const handleSelectOdd = (e) => {
    evenActive = !evenActive
    if (evenActive)
        e.classList.add("sub-button-active")
    else
        e.classList.remove("sub-button-active")
    changeStylesheet()
}

// Удалить последний элемент
const handleRemoveLast = () => {
    if (!tasks.length)
        return

    const e = taskList.children[taskList.childElementCount - 1]
    const value = e.getAttribute("key")
    let index = -1
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == value) {
            index = i
            break
        }
    }
    if (index != -1) {
        tasks.splice(index, 1)
        e.remove()
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
}

// Удалить первый элемент
const handleRemoveFirst = () => {
    if (!tasks.length)
        return

    const e = taskList.children[0]
    const value = e.getAttribute("key")
    let index = -1
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == value) {
            index = i
            break
        }
    }
    if (index != -1) {
        tasks.splice(index, 1)
        e.remove()
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
}

// Завершить задачу
const handleComplete = (e, id) => {
    let value = id
    let index = -1
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == value) {
            index = i
            break
        }
    }
    if (index != -1) {
        tasks[index].completed = Date.now()
        e.parentElement.parentElement.classList.add("completed")
        taskList.insertBefore(e.parentElement.parentElement, taskList.childNodes[taskList.childNodes.length - 1].nextSibling)
        e.remove()
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
}

// Удалить выбранную задачу
const handleRemoveSelected = (e, id) => {
    let index = -1
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            index = i
            break
        }
    }
    if (index != -1) {
        tasks.splice(index, 1)
        e.parentElement.parentElement.remove()
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
}

// Отрисовка уже добавленных задач
const loadTasks = () => {
    let completed_tasks = []
    tasks.map((element) => {
        if (!element.completed)
            insertTask(element.id, element.title, false)
        else {
            completed_tasks.push(element)
        }
    })
    // Выполненые задачи будем вставлять в конец по времени завершения
    completed_tasks.sort((a, b) => { return a.completed - b.completed; });
    completed_tasks.map((element) => {
        insertTask(element.id, element.title, true)
    })
}
const taskList = document.getElementById("task-list")
const inputForm = document.getElementById("input-form")

const styleSheet = document.createElement("style")
document.head.appendChild(styleSheet)

var oddActive = false
var evenActive = false

const tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : []

window.onload = () => {
    if (tasks != [])
        loadTasks()
}

