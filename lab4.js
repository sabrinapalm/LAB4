//request API key  
let key,
    apibtn = document.getElementById("apibtn"),
    apiKey = document.getElementById("api");

//add books
let addbtn = document.getElementById("addbtn"),
    mylist = document.getElementById("mylist"),
    title = document.getElementsByTagName("input")[0],
    author = document.getElementsByTagName("input")[1],
    result = document.getElementById("result"),
    failed = 0;

//change books
let change = document.getElementById("change");




//EVENT LISTENERES
apibtn.addEventListener('click', function(event){
    getKey() //calling getKey function
});


addbtn.addEventListener('click', function(event){
    event.preventDefault();
    addBook() //calling addBook function
});


change.addEventListener('click', function(event){  
    changeBook(); //calling changeBook function
});


//FUNCTIONS 
//get key function
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




//add book function

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

            let li = document.createElement("LI");
            li.innerHTML = `Title: ${title.value} <br /> 
                            Author: ${author.value} <br /> 
                            ID: ${ob1.id}`;
            
            mylist.appendChild(li);
            
        }   
    } 
} 
addreq.send();
}


//change book function
function changeBook() {
    
}


