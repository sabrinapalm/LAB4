
document.addEventListener('DOMContentLoaded', function(){
    
    
    
//request API key 
    
let apiBtn = document.getElementById("apibtn");
    

apiBtn.addEventListener('click', function(event){
    
    let apiKey = document.getElementById("api");
    let req = new XMLHttpRequest();

    req.onreadystatechange = function(event) {
    
    if (req.readyState == 4) {
        let ob = JSON.parse(req.responseText);
        let key = ob.key;
        api.innerHTML = `= ${key}`;
    }        
}
req.open('GET', 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey');
req.send();
    
})


    
//delete books
const list = document.getElementsByTagName("ul")[0];

list.addEventListener('click', function(event){
    
    if (event.target.className == 'delete') {
        const li = event.target.parentElement;
        list.removeChild(li);
    }
})




//search for books

const search = document.getElementById("search");

search.addEventListener('keyup', function(event){
    
    const term = event.target.value.toLowerCase();
    const books = list.getElementsByTagName('li');
    
    Array.from(books).forEach(function(book){
        const title = book.firstElementChild.textContent;
        
        if (title.toLowerCase().indexOf(term) != -1) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    })
}) 
    
    
    
    
    
});

