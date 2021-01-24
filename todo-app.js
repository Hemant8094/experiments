       // initialization
       var print = console.log;
       var divelem = document.getElementById("createtodo");
        var ollist = document.getElementById("list");
        var inputEle= divelem.getElementsByTagName('input');
        var buttonEle= divelem.getElementsByTagName('button');
        var imgtag = document.getElementById("giveimg");
        var cleartag = document.getElementById("clearbutton");
        var clearbutton = cleartag.getElementsByTagName("button");
        var tolist = [];
        var checked = {};        

        // execution
        showBlankScreen(); 
        openfile();
         
        // declaration

        function search() {
            if(window.event.key === 'Enter') {
                addTodo();      
            }
        }
       
        function sendingtolist(as){
            showBlankScreen();
            var newar = '';
            as.forEach((x, i) => {
                var ischecked = checked[x.uid]

                var htmll = ` 
                <li>
                    <div class="todo_element" id = "editid${x.uid}">
                        <input type="checkbox" id = "checkbox${x.uid}" onchange = "checkboxfunc(${x.uid})" ${ischecked==true?"checked":"unchecked"}>
                        <span id = "checkedtext${x.uid}" class = "checkedtext" title = "you have completed this ">
                           ${ischecked?"completed":""} 
                        </span>
                        <span>${x.todoValue}</span>
                    </div>
                    <div class = "create_relative">
                        <button class = "buttoncss" onclick='deleteTodo(${x.uid})' data-title="click here to delete">x</button>
                        <button class = "buttoncss" onclick='edit(${x.uid})' data-title="click here to edit">edit</button>
                    </div>
               </li>`
               
                newar = newar+ htmll;
                
            })
            ollist.innerHTML = newar;
        }

        function showBlankScreen() {
            if (tolist.length == 0) {
                imgtag.innerHTML =  '<img src = "./empty.png" ><p> <strong>YOU HAVE NOT MADE TODO </strong></p>';
            } else {
                imgtag.innerHTML =  '';
            }
        }

        function addTodo() {
            if (inputEle[0].value != ''){
                const todo = {
                    "todoValue": inputEle[0].value,
                    "uid": uuidv4() 
                } 
                tolist.push(todo);
                inputEle[0].value = null;

                sendingtolist(tolist)
                imgtag.innerHTML = '';
                savingdata();
            }
            
        }
        function savingdata(){
            localStorage.setItem("todosave",JSON.stringify(tolist));
            localStorage.setItem("todochecked",JSON.stringify(checked));
        }
        function clearbuttton(){
            tolist = [];
            checked={};
            
            sendingtolist(tolist);
            savingdata();
        }
        function openfile(){
            var data = localStorage.getItem("todosave");
            var _checked = localStorage.getItem("todochecked");
            if (data) {
                tolist = JSON.parse(data);
            }
            if (_checked) {
                checked = JSON.parse(_checked);
            }
            sendingtolist(tolist);
        }

        function deleteTodo(uid) {
            const index = tolist.findIndex(x => x.uid === uid);

            tolist.splice(index, 1);
            deletechecked(uid);
            sendingtolist(tolist);
            savingdata();

        }
        function deletechecked(uid){
            if (checked[uid]){
                delete checked[uid];
            }
        }
        function checkboxfunc(i){
            var checkboxx = document.getElementById(`checkbox${i}`);
            var checkedtextt = document.getElementById(`checkedtext${i}`);

            if (checkboxx.checked == true){
                checked[i] = true;
                checkedtextt.innerHTML = "completed";
            } else{
                checked[i] = false;
                checkedtextt.innerHTML = "";
            }
            savingdata();
        }

        function edit(uid){
            var editbox = document.getElementById(`editid${uid}`);
            const input = document.createElement("INPUT");
            const elem = tolist.find(x => x.uid === uid);
            input.value = elem.todoValue;
            Array.from(editbox.children).forEach(e => e.remove());
            editbox.appendChild(input);

            const button = document.querySelector(`.buttoncss[onclick="edit(${uid})"]`);
            const buttonParent = button.parentElement; 
            button.remove();
            const saveButton = document.createElement("BUTTON");
            saveButton.innerText = "Save";
            saveButton.classList.add('buttoncss');
            saveButton.dataset.title = "click to save";
            saveButton.onclick = function () {
                if (input.value) {
                    const index = tolist.findIndex(x => x.uid === uid);

                    tolist[index].todoValue = input.value;
                    savingdata();
                    sendingtolist(tolist);
                }
            }
            buttonParent.appendChild(saveButton);
              
        }

        function uuidv4() {
            const fn = () => Math.random() * 2 + 0.5 / 10;
            return fn() + fn() + fn()
        }