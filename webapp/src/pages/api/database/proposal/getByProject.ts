import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Proposal from "src/database/models/proposal";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            project_id
        } = req.body;
        if (project_id) {
        
            try {
                let proposals = await Proposal.find({project_id: project_id}).sort({created_at: -1});
                return res.status(200).send(proposals);
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