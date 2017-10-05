const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const moment = require('moment');
const path = require('path')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, 'static')))
app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/quoting_dojo')
var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    quote: { type: String, required: true, minlength: 10 },
    created: { type: Date, default: moment() }
})
mongoose.model('Quote', QuoteSchema)
var Quote = mongoose.model('Quote')
mongoose.Promise = global.Promise


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/quotes', (req, res) => {
    Quote.find({}, (err, quotes) => {
        if(err){
            console.log('something went wrong')
        }
        else{
            console.log('successfully queried quotes')
        }
        console.log(moment(quotes[0].created).format('lll'))
        res.render('quotes', {quotes:quotes, moment:moment})
    })
})

app.post('/quotes', (req, res) => {
    console.log("POST DATA", req.body);
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    quote.save((err) => {
      if(err) {
          let errors = []
          if(quote.errors.quote.message){
              errors.push(quote.errors.quote.message)
          }
          else if(quote.errors.name.message){
              errors.push(quote.errors.name.message)
          }
          console.log(errors)
          console.log('something went wrong')
          res.render('index', {errors: errors})
      } else { 
        console.log('successfully added a user!');
        res.redirect('/quotes');
      }
    })
})


app.listen(8000, () => {
    console.log("listening on port 8000")
})
