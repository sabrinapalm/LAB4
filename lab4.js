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
let change = document.getElementById("change");




/************************EVENT LISTENERS************************/
apibtn.addEventListener('click', function(event){
    getKey() //calling getKey function
});


addbtn.addEventListener('click', function(event){
    event.preventDefault();
    addBook() //calling addBook function
});


/*change.addEventListener('click', function(event){  
    changeBook(); //calling changeBook function
});*/


mylist.addEventListener('click', function(event){
    deleteBook(); //calling delBook function
})




/************************FUNCTIONS************************/


//GET API KEY FUNCTION
function getKey() {
    
    let req = new XMLHttpRequest();
    
    req.open('GET', 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey', true);

    req.onreadystatechange = function(event) {
    
    if (req.readyState == 4 && req.status == 200) {
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
            
            //CREATE NEW ELEMENTS
            let li = document.createElement('LI');
            let del = document.createElement('span');
            
            //ADD CONTENT
            del.textContent = 'delete';
            
            //ADD CLASS TO DEL BUTTON
            del.classList.add('delete');
            

            li.innerHTML = `Title: <span>${title.value}</span> <br /> 
                            Author: <span>${author.value}</span> <br /> 
                            ID: <span>${ob1.id}</span> <br /> <br />`
            
            //ADD TO DOM
            li.appendChild(del);
            mylist.appendChild(li);
            
        }   
    } 
} 
addreq.send();
}


//CHANGE BOOK FUNCTION
function changeBook() {
    
}


//DELETE BOOK FUNCTION
function deleteBook() {
    
    if (event.target.className == 'delete') {
        let li = event.target.parentElement;
        mylist.removeChild(li);
        
  }
}

  
