var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StorySchema = new Schema({
    
    creater:{type:Schema.Types.ObjectId,ref:'User'},
    content:{type:String},
    created:{type:String,default:Date.now}
    
    
});

module.exports = mongoose.model('Story',StorySchema);