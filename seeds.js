//seed the db so you have some data to start out with
const Book=require('./models/book')
const mongoose=require('mongoose')
const print=console.log
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/booksApp');
  }
  main().then(()=>{
      print('connection sauce')
  }).
  catch(err => console.log(err));
// const product=new Product({
//     name:'grape',
//     price:5,
//     category:'fruit'
// })
// product.save().then(
//     (res)=>{
//         print('yeah it worked')
//         print(res)
//     }
// ).catch((e)=>{
//     print(e)
// })



Book.insertMany([
    {
        name:'A tale of two cities',
        price:15,
        author:'Charles Dickens',
        genre:'Thriller',
        stock:10
    },
    {
        name:'The Cockrow',
        price:5,
        author:'Ama Atta Aidoo',
        genre:'Thriller',
        stock:30
    },
    {
        name:'4 Your Eyez Only',
        price:25,
        author:'Jermaine Cole',
        genre:'Suspenseful',
        stock:80
    },
    {
        name:'FRIENDS',
        price:20,
        author:'Jermaine Cole',
        genre:'Suspenseful',
        stock:35
    },
])