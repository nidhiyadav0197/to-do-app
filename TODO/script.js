
'use strict';

let colorBtn = document.querySelectorAll(".filter");
let mainCont = document.querySelector(".main-container");
let plusButton = document.querySelector(".fa-plus");
let crossButton = document.querySelector(".fa-times");
let refreshButton = document.querySelector(".fa-sync-alt");
let deleteAllButton = document.querySelector(".fa-trash-alt");
let allTaskCont = document.querySelector(".all-task-container");
let completedTaskCont = document.querySelector(".completed-task-container");
let body = document.body;
let deleteState = false;
let availColors = [];
let taskArr = [];


// load task initially
if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask"));

    for (let i = 0; i < taskArr.length; i++) {
        let { id, color, task, completed } = taskArr[i];
        createTask(color, task, false, id, completed);
    }
}

// make array of available colors
for (let i = 0; i < colorBtn.length; i++) {
    let color = colorBtn[i].children[0].classList[1];
    availColors.push(color);
}

// specific priority task display

for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function (e) {

        // class list will give all the classes associated with the element
        //console.log(colorBtn[i].classList[1]);
        let color = colorBtn[i].children[0].classList[1];
        let taskCont = document.querySelectorAll(".task_container");
        for (let i = 0; i < taskCont.length; i++) {

            let clr = taskCont[i].children[0].classList[1];
            if (clr == color) {
                taskCont[i].style.display = "block";
            }
            else {
                taskCont[i].style.display = "none";
            }

        }


    })
}

// add task -> create modal -> add task
plusButton.addEventListener("click", function () {

    let modalexist = document.querySelectorAll(".modal_container")
    if (modalexist.length == 0) {
        createModal(false, "");

    }

})

// to delete selected task
crossButton.addEventListener("click", setDeleteState);

// display all the task with all the priorities
refreshButton.addEventListener("click", function () {

    let taskCont = document.querySelectorAll(".task_container");
    for (let i = 0; i < taskCont.length; i++) {
        taskCont[i].style.display = "block";
    }

})

// delete all completed task
deleteAllButton.addEventListener("click", function () {

    let completedTaskList = completedTaskCont.querySelector(".completed-task-list");
    let taskcont = completedTaskList.querySelectorAll(".completed_task_container");
    for (let i = taskcont.length - 1; i >= 0; i--) {
        taskcont[i].remove();
    }

    for (let i = taskArr.length - 1; i >= 0; i--) {

        let { completed } = taskArr[i];
        if (completed) {
            taskArr.splice(i, 1);

        }
    }
    let finalArr = JSON.stringify(taskArr);
    localStorage.setItem("allTask", finalArr);

})


// create modal -> enter task
function createModal(editText, taskcont) {

    let modal_container = document.createElement("div");
    modal_container.setAttribute("class", "modal_container");
    modal_container.innerHTML = `<div class = "input_container">
    <textarea class="modal_input" placeholder="Enter Your Task Here"></textarea>
    </div>
    <div class="modal_filter_container">

        <div class = "filter_task palevioletred"></div>
        <div class = "filter_task blue"></div>
        <div class = "filter_task limegreen"></div>
        <div class = "filter_task black"></div>


    </div>`


    body.appendChild(modal_container);
    if (editText) {
        addModalEvents(true, taskcont);
    }
    else {
        addModalEvents(false, "");
    }

}

// modal events
function addModalEvents(editText, taskcont) {
    let colorList = document.querySelectorAll(".modal_filter_container .filter_task");
    let selectedColor = "black";

    if (!editText)
        colorList[3].classList.add("border");

    // add border event to color list
    for (let i = 0; i < colorList.length; i++) {
        colorList[i].addEventListener("click", function (e) {

            colorList.forEach((filter) => {
                filter.classList.remove("border");
            })

            colorList[i].classList.add("border");
            selectedColor = colorList[i].classList[1];

        })
    }

    let input = document.querySelector(".modal_input");
    let uidElem = "";
    let idx = 0;

    // if it is called by edit option then copy the text, add border to the selected color
    if (editText) {
        input.value = taskcont.querySelector(".task_desc").innerText;

        // get local storage index of task container
        uidElem = taskcont.querySelector(".uid").innerText.split("#")[1];

        for (let i = 0; i < taskArr.length; i++) {
            let { id } = taskArr[i];
            if (id == uidElem) {
                idx = i;
                console.log(idx);
                break;
            }
        }

        // remove border from all the colors
        let color = taskcont.children[0].classList[1];
        selectedColor = color;
        colorList.forEach((filter) => {
            filter.classList.remove("border");
        })
        // add initial border
        for (let i = 0; i < colorList.length; i++) {
            if (color == colorList[i].classList[1]) {
                colorList[i].classList.add("border");
                break;
            }
        }

        //color changed
        for (let i = 0; i < colorList.length; i++) {
            colorList[i].addEventListener("click", function (e) {

                colorList[i].classList.add("border");
                taskcont.children[0].classList.remove(color);
                taskcont.children[0].classList.add(colorList[i].classList[1]);
                taskArr[idx].color = colorList[i].classList[1];
                let finalArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalArr);

            })
        }

    }



    input.addEventListener("keydown", function (e) {

        if (e.key == "Enter") {

            var inputText = input.value;
            inputText = inputText.trim();
            document.querySelector(".modal_container").remove();

            if (editText) {
                taskcont.querySelector(".task_desc").innerText = inputText;
                taskArr[idx].task = inputText;
                let finalArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalArr);
            }
            else {
                if (inputText.length > 0) {
                    createTask(selectedColor, inputText, true);
                }
            }
        }
    })


}

//create task
function createTask(color, text, flag, id, completed) {
    let taskCont = document.createElement("div");

    let uifn = new ShortUniqueId();
    let uid = id || uifn();
    let isComplete = completed;



    if (isComplete) {
        taskCont.setAttribute("class", "completed_task_container");
        taskCont.innerHTML = `
            <div class="task_header_color ${color}"></div>
            <div class="task_body">
                <div class="uid">#${uid}</div>
                <div class="task_desc" style="text-decoration: line-through">${text}</div>
                <div class="task-footer">
                    <i class="far fa-check-circle" style = "color:#32CD32;width:100%;margin-left:80%;"></i>
                   
                </div>
            </div>
            
            `;
        document.querySelector(".completed-task-list").appendChild(taskCont);
    }
    else {
        taskCont.setAttribute("class", "task_container");
        taskCont.innerHTML = `
            <div class="task_header_color ${color}"></div>
            <div class="task_body">
                <div class="uid">#${uid}</div>
                <div class="task_desc">${text}</div>
                <div class="task-footer">
                    <div class="edit">
                    <i class="fas fa-pencil-alt"><p class="tooltiptext2">Edit</p></i>
                    </div>
                    <div class="done">
                    <i class="far fa-check-circle"><p class="tooltiptext2">Mark as complete</p></i>
                    </div>
                </div>
            </div>
            
            `;


        document.querySelector(".all-task-container").appendChild(taskCont);
        let taskHeader = taskCont.querySelector(".task_header_color");

        if (flag == true) {
            let obj = { "task": text, "id": `${uid}`, "color": color, "completed": false };
            taskArr.push(obj);
            let finalArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalArr);
        }


        taskHeader.addEventListener("click", changeColor);
        taskCont.addEventListener("click", deleteTask);
        let completeIcon = taskCont.querySelector(".fa-check-circle");
        completeIcon.addEventListener("click", addToCompleteTask);
        let editIcon = taskCont.querySelector(".fa-pencil-alt");
        editIcon.addEventListener("click", editTask);
    }



}

// change priority
function changeColor(e) {

    // on which we are adding event listener
    //console.log(e.currentTarget);

    // on which the event is occuring
    //console.log(e.target);

    let taskHeader = e.currentTarget;
    let currcolor = taskHeader.classList[1];
    let idx = availColors.indexOf(currcolor);
    taskHeader.classList.remove(currcolor);
    idx = (idx + 1) % 4;
    taskHeader.classList.add(availColors[idx]);


    let uidElem = taskHeader.parentNode.querySelector(".uid");
    let uid = uidElem.innerText.split("#")[1];

    for (let i = 0; i < taskArr.length; i++) {
        let { id } = taskArr[i];
        if (id == uid) {
            taskArr[i].color = availColors[idx];
            console.log(availColors[idx]);
            let finalArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalArr);

            break;
        }
    }


}

// cross button active state
function setDeleteState(e) {
    let crossparent = e.currentTarget.parentNode;
    if (deleteState == false) {
        crossparent.classList.add("active");

    }
    else {
        crossparent.classList.remove("active");
    }

    deleteState = !deleteState;
}


// delete task from all task
function deleteTask(e) {
    let taskCont = e.currentTarget;

    if (deleteState) {

        let uidElem = taskCont.querySelector(".uid");
        let uid = uidElem.innerText.split("#")[1];
        for (let i = 0; i < taskArr.length; i++) {
            let { id } = taskArr[i];
            if (id == uid) {
                taskArr.splice(i, 1);
                let finalArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalArr);
                taskCont.remove();
                break;
            }
        }

    }
}

// edit task
function editTask(e) {

    let taskcont = e.currentTarget.parentNode.parentNode.parentNode.parentNode;
    createModal(true, taskcont);

}


// remove from task and add to complete task

function addToCompleteTask(e) {
    let taskcont = e.currentTarget.parentNode.parentNode.parentNode.parentNode;

    // set complete as true
    let uidElem = taskcont.children[1].children[0];
    let color = taskcont.children[0].classList[1];
    let text = taskcont.children[1].children[1].innerText;

    let uid = uidElem.innerText.split("#")[1];
    for (let i = 0; i < taskArr.length; i++) {
        let { id } = taskArr[i];
        if (id == uid) {
            taskArr[i].completed = true;
            let finalArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalArr);

            break;
        }
    }
    createTask(color, text, false, uid, true);
    e.currentTarget.removeEventListener("click", addToCompleteTask);
    taskcont.remove();

}
