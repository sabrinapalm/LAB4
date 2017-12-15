document.addEventListener('DOMContentLoaded', function () {
/************************VARIABLES************************/
//REQUEST API KEY 
let apibtn = document.getElementById("apibtn"),
    apiKey = document.getElementById("api"),
    key;
//ADD BOOKS
let addbtn = document.getElementById("addbtn"),
    mylist = document.getElementById("mylist"),
    child = document.getElementById("empty"),
    title = document.getElementsByTagName("input")[0],
    author = document.getElementsByTagName("input")[1],
    result = document.getElementById("result"),
    failed = 0;
//VIEW BOOKS
let viewBtn = document.getElementById("viewBtn"),
    output = document.getElementById("output");
    
    
/************************EVENT LISTENERS************************/
apibtn.addEventListener('click', function (event) {
    getKey() //calling getKey function
});
addbtn.addEventListener('click', function (event) {
    event.preventDefault();
    addBook() //calling addBook function 
});
mylist.addEventListener('click', function (event) {
    changeBook(); //calling changeBook function
});
mylist.addEventListener('click', function (event) {
    deleteBook(); //calling delBook function
});
viewBtn.addEventListener('click', function (event) {
    viewBook(); //calling viewBooks function
});
    
    
/************************FUNCTIONS WITH API REQUESTS************************/
//GET API KEY FUNCTION
function getKey() {
    let req = new XMLHttpRequest();
    req.open('GET', 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey', true);
    req.onreadystatechange = function (event) {
        if (this.readyState == 4 && this.status == 200) {
            let ob = JSON.parse(req.responseText);
            key = ob.key;
            apibtn.innerHTML = `Recieved: ${key}`;
        }
    }
    req.send();
}
    
//ADD BOOK FUNCTION
function addBook() {
    let addreq = new XMLHttpRequest();
    addreq.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${key}&title=${title.value}&author=${author.value}`, true)
    addreq.onload = function () {
        if (this.status == 200 && this.readyState == 4) {
            let ob1 = JSON.parse(this.responseText)
            if (ob1.status == "error") {
                failed = failed + 1;
                result.innerHTML = `Error message: ${ob1.message} <br />Failed: ${failed}`;
                result.style.color = "#CF0A2C";
            } else {
                let ob2 = JSON.parse(this.responseText);
                child.style.display = "none";
                //CREATE NEW ELEMENTS
                let li = document.createElement('li');
                let bookTitle = document.createElement('span');
                let authorTitle = document.createElement('span');
                let idTitle = document.createElement('p');
                let del = document.createElement('button');
                //ADD CONTENT
                del.textContent = 'X';
                bookTitle.textContent = title.value;
                authorTitle.textContent = author.value;
                idTitle.textContent = `ID: ${ob2.id}`;
                //ADD CLASS TO SPAN
                bookTitle.classList.add('name');
                authorTitle.classList.add('name');
                del.classList.add('delete');
                //ADD TO DOM
                li.appendChild(bookTitle);
                li.appendChild(authorTitle);
                li.appendChild(idTitle);
                li.appendChild(del);
                mylist.appendChild(li);
                //STYLE
                mylist.style.display = "none";
                viewBtn.style.display = "block";
                result.innerHTML = `${title.value}, ${author.value} was succesfully added! ID: ${ob2.id}`;
                result.style.color = "black";
            }
        }
    }
    addreq.send();
}
    
//VIEW BOOK FUNCTION
function viewBook() {
    let viewreq = new XMLHttpRequest();
    viewreq.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${key}`, true);
    viewreq.onload = function () {
        let obj = JSON.parse(viewreq.responseText);
        if (obj.status == 'success') {
            let objdata = Array.from(obj.data);
            for (i = 0; i < objdata.length; i++) {
                console.log(`${objdata[i].id}, ${objdata[i].title}, ${objdata[i].author}, ${objdata[i].updated}`);
                mylist.style.display = "block";
                viewBtn.style.display = "none";
            }
        } else {
            failed = failed + 1;
            result.innerHTML = `Ooops! Something went wrong! Try again!<br />Failed: ${failed}`;
            result.style.color = "#CF0A2C";
        }
    }
    viewreq.send();
}
    

/***********************FUNCTIONS WITHOUT API REQUESTS :(***********************/
//CHANGE BOOK FUNCTION
function changeBook() {
    let span,
        input,
        text;
    span = event.target
    // Check span
    if (span && span.tagName.toUpperCase() === "SPAN") {
        // Hide it
        span.style.display = "none";
        // Get text content
        text = span.innerHTML;
        //Create element
        input = document.createElement("input");
        input.type = "text";
        input.value = text;
        //Style element
        input.size = Math.max(text.length);
        input.style.outline = "none";
        input.style.fontFamily = "Josefin Sans";
        input.style.fontSize = "1em";
        input.style.letterSpacing = "1px";
        span.parentNode.insertBefore(input, span);
        // Focus method to focus element
        input.focus();
        //Blur eventlistener
        input.addEventListener('blur', function (event) {
            span.parentNode.removeChild(input);
            // Update span with new text content
            span.innerHTML = input.value == "" ? "&nbsp;" : input.value;
            // Show span again
            span.style.display = "";
        });
    };
}
    
//DELETE BOOK FUNCTION
function deleteBook() {
    if (event.target.className == 'delete') {
        let li = event.target.parentElement;
        mylist.removeChild(li);
    }
    if (mylist.children.length == 0) {
        viewBtn.style.display = "none";
        child.style.display = "block";
    }
}
});