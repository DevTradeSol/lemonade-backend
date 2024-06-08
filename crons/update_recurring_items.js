const cron = require('node-cron');
var dbConfig = require('../config/database');
var mongoose = require('mongoose');
var Item = require("../models/item");

mongoose.connect(dbConfig.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("DB connection successful");
});

function updateRecurringItemsStatus() {
  Item.find({status: 'Paid', isRecurring: true, 'recurringDays.1': {$exists: true}}).sort({'createdAt': -1}).then((items) => {
    console.log(items.length);
    if (!items) {
      return 'Items does not Exist';
    }
    items.forEach(element => {

      let obj = element.toObject();
      delete obj._id;
      const docClone = new Item(obj);
      docClone.status = 'Accepted';
      docClone.completedAt = [];
      docClone.paidAt = [];
      console.log(docClone);
      docClone.save();

      element.isRecurring = false;
      element.save();
    });
    console.log('success');
    return 'Success';
  });
}

// Schedule the cron job to run every midnight 
// cron.schedule('0 0 0 * * *', () => {
cron.schedule('*/5 * * * *', () => {
  updateRecurringItemsStatus();
});