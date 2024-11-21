const express=require('express')
const path=require('path')
const app=express()
const mongoose=require('mongoose')
const Book=require('./models/book')
const print=console.log
const methodOverride=require('method-override')
app.use(methodOverride('_method'))

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/booksApp');
  }
  main().then(()=>{
      print('connection sauce')
  }).
  catch(err => console.log(err));

  app.get('/books/new', (req,res)=>{
 res.render('add_book.ejs')
})



app.get('/books',async (req,res)=>{
    const books=await Book.find({})
    print(books)

    res.render('books.ejs',{books})

})

   // name
    // price
    // author
    // genre
    // stock 

app.post('/books',async (req,res)=>{
    const {name,price,genre,author,stock}=req.body
    const newBook= new Book({name,price,genre,author,stock})
    newBook.save()
    .then(
        (res)=>{
            print(res)
            print('saved the shit')
        })
    .catch((e)=>{print(e)})
    
    res.redirect('/books')

})


app.get('/books/:id',async (req,res)=>{
    const id=req.params.id
    
    const book=await Book.find({_id:id})

    
    

    res.render('book_details.ejs',{book:book[0]})

})
app.get('/books/:genre/filter', async (req, res) => {
    try {
        const genre = req.params.genre;

        const books = await Book.find({ genre: genre });
        console.log('NEW ROUTEEEE');
        console.log(books);

        res.render('filter_by_genre.ejs',{books,genre})
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('An error occurred while fetching books.');
    }
})

app.get('/books/:id/edit',async(req,res)=>{
    const id=req.params.id
    const book=await Book.find({_id:id})

    res.render('update_book.ejs',{book:book[0],id})

})


app.patch('/books/:id',async (req,res)=>{
    const id=req.params.id
    
    let book=await Book.findByIdAndUpdate(id,req.body,{runValidators:true,new:true})

    print(book)
    print('HMMMMM')
    print(req.body)
    res.redirect(`/books/${id}`)

})


app.delete('/books/:id',async (req,res)=>{
    const id=req.params.id
    
    let deletedBook=await Book.findByIdAndDelete(id)

    res.redirect(`/books`)

})






app.listen(3000,()=>{
    print('server up and running')
    
})