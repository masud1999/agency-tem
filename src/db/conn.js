const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/agency-tem',

{  useFindAndModify:true,  useNewUrlParser:true,
    useUnifiedTopology:true,  useCreateIndex:true
}).then(() => {
    console.log(`connection successfull`);
}).catch((error) => {
    console.log(`No Connection`);
})


