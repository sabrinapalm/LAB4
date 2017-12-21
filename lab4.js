/*jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', function () {
/************************VARIABLES************************/
//REQUEST API KEY 
let key;
//ADD BOOKS FROM API
let searchbtn = document.getElementById("searchbtn"),
    mysearchlist = document.getElementById("mysearchlist"),
    title = document.getElementsByTagName("input")[0],
    author = document.getElementsByTagName("input")[1],
    results = document.getElementById("results"),
    searchresult = document.getElementsByClassName("searchresult"),
    failed = 0;
//ADD BOOKS TO LIST
let likebutton = document.getElementsByClassName('likebutton'),
    books = document.getElementsByClassName('books'),
    empty = document.getElementById("empty"),
    result = document.getElementById("result");
//VIEW BOOKS
let viewBtn = document.getElementById("viewBtn"),
    mylist = document.getElementById("mylist");
//DELETE BOOKS 
let delBtn = document.getElementsByClassName('delete');
/************************EVENT LISTENERS************************/
window.addEventListener('load', function (event) {
    getKey(); //calling getKey function
});
searchbtn.addEventListener('click', function (event) {
    event.preventDefault();
    searchBook(); //calling addBook function on API
});
viewBtn.addEventListener('click', function (event) {
    viewBook(); //calling viewBooks function
});
mylist.addEventListener('click', function (event) {
    changeBook(); //calling changeBook function
});
mylist.addEventListener('click', function (event) {
    deleteBook(); //calling delBook function
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
            console.log(`Requested key: ${key}`);
        }
    };
    req.send();
}
//SEARCH BOOK FUNCTION FROM API, TRY FETCH
function searchBook() {
    results.style.display = "flex";
    results.innerHTML = "";
    fetch(`https://www.googleapis.com/books/v1/volumes?key=AIzaSyC6vfRj8Y3NoFuKBKEci9x1tDI5faifJBA&q=${title.value}q=${author.value}&maxResults=10`).then(function (response) {
        return response.json();
    }).then(function (json) {
        results.innerHTML = "";
        if (json.totalItems === 0) {
            results.innerHTML = `Your search gave no hits&nbsp<i class="fa fa-frown-o" aria-hidden="true">`;
            return false;
        }
        mylist.style.display = "none";
        let id = 0;
        for (let i = 0; i < json.items.length; i++) {
            //CREATE ELEMENTS
            let div = document.createElement('div');
            let bookTitle = document.createElement('span');
            let authorTitle = document.createElement('span');
            let published = document.createElement('p');
            let img = document.createElement('img');
            let button = document.createElement('button');
            //ADD CLASSES AND ATTRIBUTES
            button.className = 'likebutton';
            div.className = 'books';
            button.setAttribute('id', 'add' + id++);
            div.setAttribute('id', 'content', id++);
            //GET IMG SRC
            if (json.items[i].volumeInfo.readingModes.image === false) {
                img.src = `resources/no_book_cover_lg.jpg`;
            } else {
                img.src = `${json.items[i].volumeInfo.imageLinks.thumbnail}`;
            }
            // ADD CONTENT
            bookTitle.innerHTML = `<h3>${json.items[i].volumeInfo.title}<br></h3>`;
            authorTitle.innerHTML = `<strong>By:</strong> ${json.items[i].volumeInfo.authors}<br>`;
            published.innerHTML = `<strong>Published:</strong> ${json.items[i].volumeInfo.publishedDate}`;
            button.innerHTML = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
            //ADD TO DOM
            div.appendChild(img);
            div.appendChild(bookTitle);
            div.appendChild(authorTitle);
            div.appendChild(published);
            div.appendChild(button);
            results.appendChild(div);
            //STYLE
            button.style.display = "block";
            searchresult[0].style.display = "block";
            img.style.cssFloat = "left";
            results.innerHTML = results.innerHTML;
        }
        //ADD EVENTLISTENER ON ALL LIKE BUTTONS
        for (let i = 0; i < likebutton.length; i++) {
            likebutton[i].addEventListener('click', function () {
                addBook();
                //WHY FUNCTION DOESNT WORK CALLING IT FROM THE OUTSIDE? SCOPE? ASK DAVID!
                function addBook() {
                    fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${key}&title=${json.items[i].volumeInfo.title}&author=${json.items[i].volumeInfo.authors}`).then(function (res) {
                        return res.json();
                    }).then(function (json) {
                        if (json.status == 'success') {
                            likebutton[i].innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>`;
                            result.innerHTML = (`Your book was succesfully added! <i class="fa fa-smile-o" aria-hidden="true"></i>`);
                            result.style.color = "#000";
                            viewBtn.style.display = "block";
                            empty.style.display = "none";
                        } else {
                            failed += 1;
                            result.innerHTML = `Request failed: ${failed}`;
                            result.style.color = "#CF0A2C";
                        }
                    });
                }
            });
        }
    });
}
//VIEW BOOK FUNCTION
function viewBook() {
    fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${key}`).then(function (response) {
        return response.json();
    }).then(function (json) {
        if (json.status == 'success') {
            results.style.display = "none";
            searchresult[0].style.display = "none";
            for (let i = 0; i < json.data.length; i++) {
            //CREATE NEW ELEMENTS
            let li = document.createElement('li'),
                bookTitle = document.createElement('span'),
                authorTitle = document.createElement('span'),
                published = document.createElement('p'),
                del = document.createElement('button');
                //ADD CONTENT
                del.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i>';
                bookTitle.innerHTML = `${json.data[i].title}`;
                authorTitle.innerHTML = `${json.data[i].author}`;
                published.innerHTML = `${json.data[i].updated}`;
                //STYLE
                bookTitle.style.fontSize = '1.3em';
                bookTitle.style.fontWeight = '700';
                //ADD CLASS, ID AND ATTR
                bookTitle.classList.add('name');
                authorTitle.classList.add('name');
                del.classList.add('delete');
                li.id = json.data[i].id;
                //ADD TO DOM
                li.appendChild(bookTitle);
                li.appendChild(authorTitle);
                li.appendChild(published);
                li.appendChild(del);
                mylist.appendChild(li);
                //ADD EVENTLISTENER DEL
                del.addEventListener('click', function () {
                    deleteBook(del.parentElement.id);
                });
                //STYLE
                mylist.style.display = "block";
                result.style.color = "black";
            }
        } else {
            failed += 1;
            result.style.color = "#CF0A2C";
            result.innerHTML = `Ooops! Something went wrong! Try again! <br>`;
            result.innerHTML += `Request failed: ${failed}`;
        }
    });
}
//CHANGE BOOK FUNCTION
function changeBook() {
    let span,
        input,
        text;
    span = event.target;
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
            span.innerHTML = input.value === "" ? "&nbsp;" : input.value;
            // Show span again
            span.style.display = "";
        });
    }
}
//DELETE BOOK FUNCTION UNDER PROGRESS
function deleteBook(id) {
    fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${key}&id=${id}`).then(function (response) {
        return response.json();
    }).then(function (json) {
        if (json.status == 'success') {
            //Check here, something is not right!
            mylist.removeChild(document.getElementById(id));
            result.style.color = "#000";
            result.innerHTML = `Your book was succesfully removed!`;
        } else {
            failed += 1;
            result.style.color = "#CF0A2C";
            result.innerHTML = `Request failed: ${failed}`;
        }
        if (mylist.children.length === 0) {
            viewBtn.style.display = "none";
            empty.style.display = "block";
        }
    });
}
});