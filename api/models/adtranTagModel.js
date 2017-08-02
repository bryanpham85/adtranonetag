/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
   tagId:{
       type:Number,
       Required: "Tag ID cannot empty"
   },
    script:{
       type: String,
        Required: "Script cannot be blank"
    },
    content_type: {
        type: [{
            type: String,
            enum: ['json', 'application/javascript']
        }],
        default: ['application/javascript']
    },
    provider:{
        type: String,
        default: 'Custom'
    }
});

var Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
