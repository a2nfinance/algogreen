import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Project from 'src/database/models/project';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            creator
        } = req.body;
        if (creator) {
        
            try {
                let projects = await Project.find({creator: creator, status: 1}).sort({created_at: -1});
                return res.status(200).send(projects);
            } catch (error) {
                console.log(error)
                return res.status(500).send(error.message);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);