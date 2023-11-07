import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let dao = new Schema({
    creator: {
        type: String,
        required: false,
    },
    organization_name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    zipcode: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dao_title: {
        type: String,
        required: false,
    },
    quorum: {
        type: Number,
        require: false
    },
    passing_threshold: {
        type: Number,
        require: false
    },
    submission_policy: {
        type: Number,
        require: false
    },
    dao_app_id: {
        type: Number,
        require: false,
    },
    token_id: {
        type: Number,
        require: false,
    },
    token_name: {
        type: String,
        require: false,
    },
    token_supply: {
        type: Number,
        require: false,
    },
    website: {
        type: String,
        require: false,
    },
    twitter: {
        type: String,
        require: false,
    },
    telegram: {
        type: String,
        require: false,
    },
    facebook: {
        type: String,
        require: false,
    },
    status: {
        type: Number,
        require: true,
        default: 0
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let DAO = mongoose.model('DAO', dao);
mongoose.models = {};
export default DAO;