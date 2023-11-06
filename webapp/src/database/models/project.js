import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let project = new Schema({
    creator: {
        type: String,
        required: true,
    },
    project_name: {
        type: String,
        required: true,
    },
    short_description: {
        type: String,
        required: true,
    },
    project_leader: {
        type: String,
        required: true,
    },
    contact_email: {
        type: String,
        required: true,
    },
    project_location: {
        type: String,
        required: true,
    },
    start_date: {
        type: Number,
        required: true,
    },
    end_date: {
        type: Number,
        required: true,
    },
    detail_document: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },
    telegram: {
        type: String,
        required: false,
    },
    github: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    is_eco_project: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Project = mongoose.model('Project', project);
mongoose.models = {};
export default Project;