document.addEventListener('DOMContentLoaded', function() {
   
    /************************VARIABLES************************/

//REQUEST API KEY 
let key,
    apibtn = document.getElementById("apibtn"),
    apiKey = document.getElementById("api");

//ADD BOOKS
let addbtn = document.getElementById("addbtn"),
    mylist = document.getElementById("mylist"),
    title = document.getElementsByTagName("input")[0],
    author = document.getElementsByTagName("input")[1],
    result = document.getElementById("result"),
    failed = 0;

//CHANGE BOOKS
let change = document.getElementById("change"),
    ID = document.getElementsByTagName("input")[2],
    newtitle = document.getElementsByTagName("input")[3],
    newauthor = document.getElementsByTagName("input")[4];



/************************EVENT LISTENERS************************/
apibtn.addEventListener('click', function(event){
    getKey() //calling getKey function
});


addbtn.addEventListener('click', function(event){
    event.preventDefault();
    addBook() //calling addBook function
});


mylist.addEventListener('click', function(event){  
    changeBook(); //calling changeBook function
});


mylist.addEventListener('click', function(event){
    deleteBook(); //calling delBook function
})




/************************FUNCTIONS WITH API REQUESTS************************/


//GET API KEY FUNCTION
function getKey() {
    
    let req = new XMLHttpRequest();
    
    req.open('GET', 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey', true);

    req.onreadystatechange = function(event) {
    
    if (this.readyState == 4 && this.status == 200) {
        let ob = JSON.parse(req.responseText);
        key = ob.key;
        api.innerHTML = `Recieved: ${key}`;
    }  
}
req.send();  
}




//ADD BOOK FUNCTION
function addBook() {
    
    let addreq = new XMLHttpRequest(); 
    
    addreq.open('GET', `https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${key}&title=${title.value}&author=${author.value}`, true)
    
    addreq.onload = function() {
        
    if (this.status == 200) {

        let ob1 = JSON.parse(this.responseText)

        if(ob1.status == "error") {

        failed = failed + 1;
        result.innerHTML = `Error message: ${ob1.message} <br />
                            Failed: ${failed}`;

        } else {
            
            let child = document.getElementById("empty");
            
            child.style.display = "none";
            
            //CREATE NEW ELEMENTS
            let li = document.createElement('li');
            let bookTitle = document.createElement('span');
            let authorTitle = document.createElement ('span');
            let del = document.createElement('button');
            
            //ADD CONTENT
            del.textContent = 'delete';
            bookTitle.textContent = title.value;
            authorTitle.textContent = author.value;
            
            //ADD CLASS TO SPAN
            bookTitle.classList.add('name');
            authorTitle.classList.add('name');
            del.classList.add('delete');
            
            /*if (bookTitle || authorTitle == "") {
                    
                    alert('Must insert string');
                    return false;
  
                } else {}*/
                    
            //ADD TO DOM
            li.appendChild(bookTitle);
            li.appendChild(authorTitle);
            li.appendChild(del);  
            
            mylist.appendChild(li);
            
        }   
    } 
} 
addreq.send();
}


/***********************FUNCTIONS WITHOUT API REQUESTS***********************/


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
        input.addEventListener('blur',function(event){
            
            span.parentNode.removeChild(input);
            
            // Update span with new text content
            span.innerHTML = input.value == "" ? "&nbsp;" : input.value;

            // Show span
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
}

  



});