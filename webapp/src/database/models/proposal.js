import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let proposal = new Schema({
    creator: {
        type: String,
        required: true,
    },
    loan_id: {
        type: String,
        require: true 
    },
    dao_id: {
        type: String,
        require: true
    },
    project_id: {
        type: String,
        require: true
    },
    proposal_app_id: {
        type: Number,
        require: true 
    },
    status: {
        type: Number,
        require: true,
        default: 1 
    },
    start_time: {
        type: Number,
        required: true,
    },
    end_time: {
        type: Number,
        required: true,
    },
    allow_early_repay: {
        type: Number,
        required: true
    },
    allow_early_execution: {
        type: Number,
        required: true
    },
    executed: {
        type: Number,
        required: true,
        default: 0
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    borrow_amount: {
        type: Number,
        require: true
    },
    interest_rate: {
        type: Number,
        require: true
    },
    term: {
        type: Number,
        require: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Proposal = mongoose.model('Proposal', proposal);
mongoose.models = {};
export default Proposal;