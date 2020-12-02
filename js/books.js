/*////////
// LIBARY
////////*/
function Library() 
{
    this.books = [];
    this.type = 'table';
    this.viewId = 'library-table';
}

Library.prototype.addBook = function(book)
{
    book.deleted = 0;
    this.books.push(book);
    console.log(myLibrary);
}

Library.prototype.removeBook = function(idx)
{
    this.books.splice(idx, 1);
}

Library.prototype.printLibrary = function() 
{
    var view = viewFactory(this.type);
    view.addToDOM();
    this.books.forEach((book,index) => {
        var item = view.createItem(book,index);
        view.insertItem();
    });
}

Library.prototype.updateView = function()
{
    var view = viewFactory(this.type);
    view.createItem(this.books[this.books.length-1], this.books.length-1);
    view.insertItem();
}

/*////////
// BOOK
/////////*/
function Book(title, author, pages, isRead)
{
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.info = function() {
    let status = (this.isRead) ? 'is read.' : 'not read yet.';
    return this.title + ' by ' + this.author + ', ' + this.pages + ', ' + status;
}

Book.prototype.toggleRead = function(id) {
    this.isRead = (this.isRead) ? false : true;   
}
/*/////////////
// VIEW TYPES
/////////////*/
const viewFactory = (type) => {
    switch (type)
        {
            case 'list':
                return new listView();
            default:
                return new tableView();
        }
}

class BookView {
    constructor(type)
    {
        this.type = type;
        this.id;
        this.elem;
        this.item;
    }
    createItem(book,index)
    {
        console.log('parent class');
    }
    insertItem(el, item)
    { 
        el.insertAdjacentHTML('beforeend',item);
    }
}

BookView.prototype.addToDOM = function() {
    document.getElementById('library').append(this.elem);
}

class listView extends BookView {
    constructor()
    {
        super();
        this.id = 'library-list';
        this.elem = document.createElement('ul');
        this.elem.setAttribute('id',this.id);
    }
    createItem(book,index)
    {
        this.item = `<!--book-->
        <li class="book" data-index="${index}" id="book-${index}">
        <p class="book-title"><span class="book-pages">${book.pages}</span> ${book.title}</p>
        <span class="book-author">${book.author}</span>
        <span class="book-read" onclick="toggleRead(this.id)" id="read-${index}">${book.isRead}</span>
        <span class="fa fa-trash-o remove-book" aria-hidden="true" onclick="removeBook(${index})></span>
        </li>
        <!--/book-->`;
    }
    insertItem()
    {
        super.insertItem(document.getElementById(this.id),this.item);
    }
}

class tableView extends BookView {
    constructor()
    {
        super();
        this.id = 'library-table';
        this.elem = document.createElement('table');
        this.elem.setAttribute('id',this.id);
        this.elem.innerHTML = `<tbody id="library-tbody"><tr>
            <th>Title</th>
            <th>Author</th>
            <th>Pages</th>
            <th>Toggle Read</th>
            <th>Remove</th>
            </tr>`;
        
    }
    createItem(book,index)
    {
        this.item = `<!--book-->
        <tr class="book-row" data-index="${index}" id="book-${index}">
        <td class="book-title">${book.title}</td>
        <td class="book-author">${book.author}</td>
        <td class="book-pages">${book.pages}</td>
        <td class="book-read" onclick="toggleRead(this.id)" id="read-${index}">${book.isRead}</td>
        <td class="remove-book"><span class="fa fa-trash-o" aria-hidden="true" onclick="removeBook(${index})></span></td>
        </tr>
        <!--/book-->`;
    }
    insertItem()
    {
        super.insertItem(document.getElementById(this.id).firstChild,this.item);
    }
}

/*//////////
// LISTENERS
///////////*/
var form = document.getElementById('userBookForm');
var lights = document.getElementById('lights-down');
//SHOW FORM
document.getElementById('addBook').addEventListener('click',() => { 
    form.classList.add('show-form');
    lights.classList.add('show');
});
//HIDE FORM 
document.querySelector('.close-form').addEventListener('click',() => { 
    closeForm();
});
//SUBMIT FORM
document.getElementById('userBookForm').addEventListener('submit',(event) => { 
    console.log(event);
    event.preventDefault(); submitBook();
});

function submitBook()
{
    var el = document.getElementById('userBookForm');
    //var forms = el.querySelectorAll('input,select');
    var title = el.querySelector('#userBookTitle').value;
    var author = el.querySelector('#userBookAuthor').value;
    var pages = el.querySelector('#userBookPages').value;
    var isRead = Boolean(Number(el.querySelector('#userBookIsRead').value));
    var myBook = new Book(title, author, pages, isRead);
    myLibrary.addBook(myBook);
    myLibrary.updateView();
    closeForm();
}
function closeForm()
{
    form.classList.remove('show-form');
    lights.classList.remove('show');
    form.reset();
}
function toggleRead(id)
{
    let idx = id.substring(id.indexOf('-')+1);
    let book = myLibrary.books[idx];
    book.toggleRead(id);
    document.getElementById(id).innerText = book.isRead; 
}

function removeBook(idx)
{
    myLibrary.books[idx].deleted = 1;
    document.getElementById('book-' + idx).remove(); 
    console.log(myLibrary);
}

/*////////
// INIT
////////*/
const myLibrary = new Library();
const displayType = 'table';

let lib = [
    ['The Hobbit', 'J.R.R. Tolkien', 295, false],
    ['Don\'t Let the Pigeon Drive the Bus', 'Mo Willems', 40, true],
    ['Goldie Locks Has Chicken Pox', 'Erin Dealey', 40, true],
    ['Beyond the Far Side', 'Gary Larson', 104, true]
]

lib.forEach((book) => {
    let newBook = new Book(book[0], book[1], book[2], book[3]);
    console.log(newBook.info());
    myLibrary.addBook(newBook);
    console.log(myLibrary);
});

myLibrary.type = displayType;
myLibrary.printLibrary();