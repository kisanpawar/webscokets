const express = require('express')
const bodyParser =  require('body-parser');

const  path  = require('node:path');

const app =  express();

app.use(bodyParser.json())


const books = [{
    bookId:1000,
    bookName:'Bhagwatgita',
    author:'Kisan Pawar',
    price:'200'
},
{
    bookId:1002,
    bookName:'Ramayan',
    author:'Kisan Pawar',
    price:'3005'
}]

//Server Events  sends

app.get('/getServerEvents', (req,res) => {

    //set the herader to events which will use for events of Data

    res.setHeader("Content-Type","text/event-stream");

    res.setHeader("Connection",'keep-alive');
    res.setHeader("Cache-control", "no-cache")

    res.write("data:server sends data \n\n")
    
    const intervalEvent = setInterval(() =>{
        res.write(`data:current event is ${new Date().toLocaleDateString()} \n\n`);
    },5000)
    

    req.on('close',() =>{
        clearInterval(intervalEvent);
    })



})



app.all('/',(req,res) =>{

    res.sendFile(path.join(__dirname,'index.html'))
   
})


app.get('/books',(req,res) =>{
    res.status(200).send(books)
  
})

app.post('/addBook',(req,res)=>{
 const _data =  req.body;
   books.push(_data); 
   res.send({
        message:'Data success fully'
   });
})


app.put("/updateBook/:id",(req,res) =>{

    const id = req.params.id;
    const updateReq =  req.body;

    console.log(id,updateReq);


    const bookFindIndex =  books.findIndex((item) => item.bookId == id );
    let msg ='';

    console.log(bookFindIndex);
    //modify Data 

    if(bookFindIndex != -1){
       books[bookFindIndex] = {
        bookId:id,
        ...books[bookFindIndex],
        ...updateReq
       }
       msg = "Data Update";
       
    }else{
        msg = "Data IS Not found"
    }
   

    res.send({
        message: msg
    })


})


app.delete("deletetBook",(req,res) =>{
    books.splice(0,1);
    res.send({
        message:"Delete Record"
    })
})

const PORT = 3005
app.listen(PORT,() =>{
    console.log("Server Start....."+PORT)
})

