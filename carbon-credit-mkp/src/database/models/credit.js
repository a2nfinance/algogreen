import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let credit = new Schema({
    title: {
        type: String,
        required: true
    }, 
    app_id: {
        type: Number,
        required: false
    },
    project_id: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true,
    },
    asset_id: {
        type: Number,
        required: false
    },
    total_credits: {
        type: Number,
        required: true
    },
    origin_price: {
        type: Number,
        required: false
    },
    allow_auction: {
        type: Number,
        required: false
    },
    max_auction_number: {
        type: Number,
        required: false,
        default: 10
    },
    status: {
        type: Number,
        required: true,
        default: 0 // 0: initialize, 1: approved & deployed contract, 2: bootstrap & sell, 3: rejected
    },
    proof_document: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Credit = mongoose.model('Credit', credit);
mongoose.models = {};
export default Credit;