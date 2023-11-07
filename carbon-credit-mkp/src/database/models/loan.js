import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let loan = new Schema({
    dao_id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    start_date: {
        type: Number,
        require: true
    },
    end_date: {
        type: Number,
        require: true
    },
    maximum_borrow_amount: {
        type: Number,
        require: true
    },
    term: {
        type: Number,
        require: true
    },
    general_interest_rate: {
        type: Number,
        require: true
    },
    special_interest_rate: {
        type: Number,
        require: true
    },
    require_collateral: {
        type: Number,
        require: true
    },
    allow_early_repay: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        require: true,
        default: 1
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Loan = mongoose.model('Loan', loan);
mongoose.models = {};
export default Loan;