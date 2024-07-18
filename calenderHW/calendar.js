const currentMonthEl = document.querySelector('.current-month');
const daysEl = document.querySelector('.days');
let currentDate = new Date();
// 獲取按鈕元素
const backToTodayBtn = document.getElementById('backToTodayBtn');

// 添加點擊事件處理程序
backToTodayBtn.addEventListener('click', () => {
  currentDate = new Date(); // 將 currentDate 設置為當前日期
  renderCalendar(currentDate); // 重新渲染行事曆
});

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  //firstDayofMonth = 當月第一天是星期幾
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  //lastDateofMonth = 當月最後一天是幾號
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  //lastDayOfMonth = 當月最後一天是星期幾
  const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
  //lastDateOfLastMonth = 前一個月最後一天是幾號
  const lastDateOfLastMonth = new Date(year, month, 0).getDate();
  const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentMonthEl.innerText = `${year} ${monthList[month]}`;
  daysEl.innerHTML = '';


  // Previous month's dates
  for (let i = firstDayOfMonth; i > 0; i--) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('date');
    dayEl.classList.add('prev-month-date');
    dayEl.classList.add('not-current-month');
    dayEl.innerText = lastDateOfLastMonth - i + 1;
    dayEl.setAttribute('data-date', `${year}${month}${i}}`);
    dayEl.setAttribute('year', `${year}`);
    dayEl.setAttribute('month', `${month}`);
    dayEl.setAttribute('date', `${i}`);
    daysEl.appendChild(dayEl);
  }

  // Current month's dates
  for (let i = 1; i <= lastDateOfMonth; i++) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('date');
    if (isCurrentMonth && i === today.getDate()) {
      dayEl.classList.add('today');
    }
    dayEl.innerText = i;
    dayEl.setAttribute('data-date', `${year}${month + 1}${i}`);
    dayEl.setAttribute('year', `${year}`);
    dayEl.setAttribute('month', `${month + 1}`);
    dayEl.setAttribute('date', `${i}`);
    daysEl.appendChild(dayEl);
  }

  // Next month's dates
  for (let i = 1; i <= (6 - lastDayOfMonth); i++) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('date');
    dayEl.classList.add('next-month-date');
    dayEl.classList.add('not-current-month');
    dayEl.innerText = i;
    dayEl.setAttribute('data-date', `${year}${month + 2}${i}`);
    dayEl.setAttribute('year', `${year}`);
    dayEl.setAttribute('month', `${month + 2}`);
    dayEl.setAttribute('date', `${i}`);
    daysEl.appendChild(dayEl);
  }

  // getTodoListFromStorage();
  const todoListEveryday = getTodoListFromStorage();

  todoListEveryday.forEach(item => {
    const temp = document.querySelector(`.date[data-date="${item.id}"]`);
    const todoContainer = document.createElement('ul');
    todoContainer.classList.add('todo-container');
    item.todoDetails.forEach((detail, index) => {
      const todoTime = document.createElement('li');
      const todoEvent = document.createElement('span');
      todoTime.innerText = detail.time;
      todoTime.classList.add('todo-time');
      todoTime.style.color = detail.color;
      todoEvent.innerText = detail.todo;
      todoEvent.classList.add('todo-event');
      todoEvent.style.color = detail.color;
      // 創建一個文本節點來表示空格
      const space = document.createTextNode(' ');

      // 在 todoTime 元素後插入空格
      todoTime.appendChild(space);

      // 將 todoEvent 元素添加到 todoTime 元素後
      todoTime.appendChild(todoEvent);
      todoTime.setAttribute('data-index', index);
      todoTime.setAttribute('data-id', item.id);
      todoTime.appendChild(todoEvent);
      todoContainer.appendChild(todoTime);
      if (temp) {
        temp.appendChild(todoContainer);
      };

      function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      todoTime.addEventListener('mouseenter', () => {
        todoTime.style.backgroundColor = hexToRgba(detail.color, 0.3); // 透明度 0.3
      });

      todoTime.addEventListener('mouseleave', () => {
        todoTime.style.backgroundColor = ''; // 移除背景顏色
      });

      todoTime.addEventListener('click', (event) => {
        //按下待辦事項後 
        event.stopPropagation(); //防止事件冒泡
        $('#todoModal').modal('show'); //show todoModal
        document.querySelector("#create_btn").classList.add("d-none");
        document.querySelector("#modify_btn").classList.remove("d-none");
        document.querySelector("#delete_btn").classList.remove("d-none");
        const yearSelect = document.getElementById('year');
        const monthSelect = document.getElementById('month');
        const daySelect = document.getElementById('day');
        yearSelect.value = temp.getAttribute('year');
        monthSelect.value = temp.getAttribute('month');
        daySelect.value = temp.getAttribute('date');

        const timeSelect = document.getElementById('todoTime');
        const eventSelect = document.getElementById('todoEvent');
        const placeSelect = document.getElementById('todoPlace');
        const colorSelect = document.getElementById('todoColor');
        timeSelect.value = detail.time;
        eventSelect.value = detail.todo;
        eventSelect.setAttribute('data-index', index);
        eventSelect.setAttribute('data-id', item.id);
        console.log(eventSelect.getAttribute('data-id'));
        placeSelect.value = detail.place;
        colorSelect.value = detail.color;

      })
    });
  });
  dateClick();
}

function saveTodoListToStorage(todoListEveryday) {
  const json = JSON.stringify(todoListEveryday);
  localStorage.setItem("todoList", json);
}

function getTodoListFromStorage() {
  //取得現在所有的todoItem,再加上去
  const localStorageItem = localStorage.getItem("todoList");
  return localStorageItem ? JSON.parse(localStorageItem) : [];
}

function init() {
  renderCalendar(currentDate);

  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // 綁定 "Back to Today" 按鈕點擊事件
  backToTodayBtn.addEventListener('click', () => {
    currentDate = new Date(); // 將 currentDate 設置為當前日期
    renderCalendar(currentDate); // 重新渲染行事曆
  });


  document.querySelector("#modify_btn").addEventListener('click', () => {
    // getTodoListFromStorage();
    const todoListEveryday = getTodoListFromStorage();
    const eventQuery = document.querySelector("#todoEvent");
    const findTodoList = todoListEveryday.find(item => item.id === eventQuery.getAttribute('data-id'));
    const waitingForModify = findTodoList.todoDetails[eventQuery.getAttribute('data-index')];
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    findTodoList.year = yearSelect.value;
    findTodoList.month = monthSelect.value;
    findTodoList.date = daySelect.value;
    findTodoList.id = `${findTodoList.year}${findTodoList.month}${findTodoList.date}`;

    const timeSelect = document.getElementById('todoTime');
    const eventSelect = document.getElementById('todoEvent');
    const placeSelect = document.getElementById('todoPlace');
    const colorSelect = document.getElementById('todoColor');
    waitingForModify.time = timeSelect.value;
    waitingForModify.todo = eventSelect.value;
    waitingForModify.place = placeSelect.value;
    waitingForModify.color = colorSelect.value;
    saveTodoListToStorage(todoListEveryday);
    renderCalendar(currentDate);
    $('#todoModal').modal('hide');
  });

  document.querySelector("#delete_btn").addEventListener('click', () => {
    // getTodoListFromStorage();
    const todoListEveryday = getTodoListFromStorage();
    const eventQuery = document.querySelector("#todoEvent");
    const findTodoList = todoListEveryday.find(item => item.id === eventQuery.getAttribute('data-id'));
    const waitingForDelete = findTodoList.todoDetails;
    waitingForDelete.splice(eventQuery.getAttribute('data-index'), 1);
    saveTodoListToStorage(todoListEveryday);
    renderCalendar(currentDate);
    $('#todoModal').modal('hide');
  });


}

function dateClick() {
  const dateElements = document.querySelectorAll('.date');
  dateElements.forEach(function (dateElement) {
    dateElement.addEventListener('click', function ShowtodoModal(date) {
      console.log("date-click");
      document.querySelector("#create_btn").classList.remove("d-none");
      document.querySelector("#modify_btn").classList.add("d-none");
      document.querySelector("#delete_btn").classList.add("d-none");
      const yearSelect = document.getElementById('year');
      const monthSelect = document.getElementById('month');
      const daySelect = document.getElementById('day');
      yearSelect.value = dateElement.getAttribute('year');
      monthSelect.value = dateElement.getAttribute('month');
      daySelect.value = dateElement.getAttribute('date');
      const timeSelect = document.getElementById('todoTime');
      const eventSelect = document.getElementById('todoEvent');
      const placeSelect = document.getElementById('todoPlace');
      const colorSelect = document.getElementById('todoColor');
      timeSelect.value = "";
      eventSelect.value = "";
      placeSelect.value = "";
      colorSelect.value = "";
      $('#todoModal').modal('show');
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const yearSelect = document.getElementById('year');
  const monthSelect = document.getElementById('month');
  const daySelect = document.getElementById('day');
  const key = "todoList";

  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    monthSelect.appendChild(option);
  }

  function fillDays() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const daysInMonth = new Date(year, month, 0).getDate();

    daySelect.innerHTML = '';
    for (let i = 1; i <= daysInMonth; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }
  }

  yearSelect.addEventListener('change', fillDays);
  monthSelect.addEventListener('change', fillDays);

  yearSelect.value = currentYear;
  monthSelect.value = new Date().getMonth() + 1;
  fillDays();

  document.getElementById('create_btn').addEventListener('click', function () {
    const year = yearSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;
    const todoTime = document.getElementById('todoTime').value;
    const todoEvent = document.getElementById('todoEvent').value;
    const todoPlace = document.getElementById('todoPlace').value;
    const todoColor = document.getElementById('todoColor').value;

    if (!todoEvent) {
      alert('請填寫行程內容');
      return;
    }

    let todoObj = {
      id: `${year}${month}${day}`,
      year: `${year}`,
      month: `${month}`,
      date: `${day}`,
      todoDetails: [
        {
          time: `${todoTime}`,
          todo: `${todoEvent}`,
          place: `${todoPlace}`,
          color: `${todoColor}`
        }
      ]
    };
    console.log(`保存行程: ${year}-${month}-${day}, ${todoTime}, ${todoEvent}`);
    console.log(todoObj);
    saveTodoItem(todoObj);
    let currentDate = new Date();
    renderCalendar(currentDate);
    $('#todoModal').modal('hide');
  });

  function getTodoListFromStorage() {
    const localStorageItem = localStorage.getItem(key);
    return localStorageItem ? JSON.parse(localStorageItem) : [];
  }

  function saveTodoItem(todoObj) {
    const todoListEveryday = getTodoListFromStorage();
    const duplicate = todoListEveryday.find(todo => todo.id === todoObj.id);
    if (duplicate) {
      duplicate.todoDetails.push(todoObj.todoDetails[0])
    }
    else {
      todoListEveryday.push(todoObj);          
    }
    saveTodoListToStorage(todoListEveryday);
  }
  function saveTodoListToStorage(todoListEveryday) {
    const json = JSON.stringify(todoListEveryday);
    localStorage.setItem(key, json);
  }

});



init();
dateClick();