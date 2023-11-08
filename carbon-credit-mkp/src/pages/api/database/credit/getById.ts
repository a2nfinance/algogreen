import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Credit from "src/database/models/credit";
import Project from "src/database/models/project";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            _id
        } = req.body;
        if (_id) {
        
            try {
                let credit = await Credit.findById(_id);
                let project = await Project.findById(credit.project_id);
                return res.status(200).send({credit: credit, project: project});
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