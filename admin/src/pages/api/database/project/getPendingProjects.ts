import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Project from 'src/database/models/project';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        let projects = await Project.find({ status: 0 }).sort({ created_at: -1 });
        return res.status(200).send(projects);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message);
    }

};

export default connect(handler);