const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

//have length of 8 or more
//be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
const phoneRegex = /^\d{2,3}-\d{5,}$/
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: {
      validator: function(v) {
        return phoneRegex.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Use format XX-XXXXXXX or XXX-XXXXXXXX.`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)