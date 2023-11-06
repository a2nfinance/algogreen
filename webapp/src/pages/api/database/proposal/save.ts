import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Proposal from 'src/database/models/proposal';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // need to validate
            const {
                creator,
                proposal_app_id,
            } = req.body;
            if (
                creator
                && proposal_app_id
                ) {
                try {
                    let proposal = new Proposal(req.body);
                    let savedProposal = await proposal.save();
                    return res.status(200).send(savedProposal);
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
    } catch(e) {
        res.status(500).send(e.message);
    }
    
};

export default connect(handler);