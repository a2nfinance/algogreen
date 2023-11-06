import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Project from 'src/database/models/project';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            creator,
            project_name
        } = req.body;
        if (
            creator
            && project_name) {
            try {
                let project = new Project(req.body);
                let savedProject = await project.save();
                return res.status(200).send(savedProject);
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