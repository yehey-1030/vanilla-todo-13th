//yehey 하이
const todoForm = document.querySelector(".submitContainer"),
    todoInput = todoForm.querySelector("input"),
    todoList = document.querySelector(".todoListContainer"),
    completeList = document.querySelector(".completeContainer");

const TODOS_LS = "todos";
let todos =[];    //여러개의 할 일들을 담을 배열
const COM_LS = 'done';
let done=[];

function loadToDos(){
    const localTodo = localStorage.getItem(TODOS_LS);
    const localDone = localStorage.getItem(COM_LS);
    if(localTodo!==null){
        //로컬스토리지에서 데이터 가져오기 String -> Obj 변환 필요
        const local = JSON.parse(localTodo);
        local.forEach(function(toDo){ addToDo(toDo.text);})
    }
    if(localDone!==null){
        //로컬스토리지에서 데이터 가져오기 String -> Obj 변환 필요
        const local = JSON.parse(localDone);
        local.forEach(function(toDo){ addComplete(toDo.text);})
    }
}
//text 기반으로 todolist에 할 일 추가
function addToDo(text){     
    const todo = document.createElement("li");
    const delBtn = document.createElement("button");
    //delBtn.innerText = "";
    delBtn.classList.add("deleteimg");
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("completeimg");
    const span = document.createElement("span");
    span.innerText = text;
    const todoId = todos.length+1;

    delBtn.addEventListener("click", deleteTodo);
    completeBtn.addEventListener("click", completeTodo);

    todo.appendChild(span);
    todo.appendChild(delBtn);
    todo.appendChild(completeBtn);
    todo.id=todoId;
    todo.classList.add("todoList");

    todoList.appendChild(todo);

    const todoObj = {
        text : text,
        id: todoId,
    };

    todos.push(todoObj);
    saveToLocal('todo');
}

//todo 리스트에서 할일 끝내면 complete 리스트에 할일을 text 기반으로 추가 
function addComplete(text){
    const completeTodo = document.createElement("li");
    const cancelBtn = document.createElement("button");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");

    cancelBtn.classList.add("cancelimg");
    delBtn.classList.add("deleteimg");

    cancelBtn.addEventListener("click", deleteCompleteTodo);  //끝낸 일에서 다시 할 일로 올림
    delBtn.addEventListener("click", deleteCompleteTodo);   //끝낸 일 삭제
    span.innerText = text;
    const completeID = done.length+1;

    completeTodo.appendChild(delBtn);
    completeTodo.appendChild(cancelBtn);
    completeTodo.appendChild(span);
    completeTodo.classList.add("completeList");
    completeTodo.id = completeID;               //이걸 추가해야 나중에 event처리할 때 id 를 이용해서 구분이 가능..! 오류 잡으려고 30분 넘게 걸렸으니까 제발,,,까먹지 말아야지...

    completeList.appendChild(completeTodo);

    const doneObj = {
        text: text,
        id : completeID,
    };
    done.push(doneObj);
    saveToLocal('done');
}

//todolist 에서 할일 삭제, 이벤트 기반
function deleteTodo(event){
    const deleteNode =  event.target.parentNode; //버튼의 부모노드를 반환해줌, 여기서 id를 찾을 수 있음!
    console.dir(deleteNode)
    todoList.removeChild(deleteNode);
    const cleanTodo = todos.filter(function(toDo){
        return toDo.id !== parseInt(deleteNode.id);       //deleteNode.id 의 값은 string, 따라서 형변환 필요
    });   //filter는 배열의 모든 아이템을 통해 함수를 실행, 함수 값이 true 인 아이템들로만 새로운 배열을 생성

    todos=cleanTodo;
    saveToLocal('todo');          //실수 했던 부분, 로컬스토리지에 저장하려면 이걸 꼭 썼어야 함,,
}

//할일 끝내면 todolist에서 할일 삭제, completelist에 할일 추가, 이벤트 기반
function completeTodo(event){
    const completeNode = event.target.parentNode;
    deleteTodo(event);
    addComplete(completeNode.textContent);    //completeNode.outerText 이거를 대신 써도 되는듯
}

//completelist 의 할 일 삭제
function deleteCompleteTodo(event){
    const delCompleteNode = event.target.parentNode;
    console.dir(delCompleteNode)
    if (event.target.className==="cancelimg"){   //삭제가 아니라 할 일로 넘겨야하는 경우
        addToDo(delCompleteNode.textContent);
    }
    completeList.removeChild(delCompleteNode);
    const cleanDone = done.filter(function(toDo){
        return toDo.id !== parseInt(delCompleteNode.id);       //deleteNode.id 의 값은 string, 따라서 형변환 필요
    });
    done = cleanDone;
    saveToLocal('done');

}

//로컬스토리지에 할 일 저장 (todolist만)
function saveToLocal(status){
    if (status === 'todo'){
        localStorage.setItem(TODOS_LS,JSON.stringify(todos));    //js 객체를 String으로 바꿔서 로컬 스토리지에 저장
    }else{
        localStorage.setItem(COM_LS,JSON.stringify(done));
    }
}

//할일 입력하면 실행되는 이벤트
function handleSubmit(event){
    event.preventDefault();
    const currentValue = todoInput.value;
    if (currentValue!==''){
        addToDo(currentValue);
    }
    todoInput.value="";
}

//기본으로 실행될 함수, 할일 입력받기 대기
function init(){
    loadToDos();
    todoForm.addEventListener("submit",handleSubmit);
}


//실행..?
init();