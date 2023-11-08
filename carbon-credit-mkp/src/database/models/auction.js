import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let auction = new Schema({
    credit_app_id: {
        type: Number,
        require: true
    },
    buyer: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: Number,
        require: true,
        default: 0
    },
    auction_index: {
        type: Number,
        require: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Auction = mongoose.model('Auction', auction);
mongoose.models = {};
export default Auction;