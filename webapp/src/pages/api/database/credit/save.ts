import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Credit from "src/database/models/credit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // need to validate
            const {
                creator,
                project_id,
            } = req.body;
            if (
                creator
                && project_id
                ) {
                try {
                    let credit = new Credit(req.body);
                    let savedCredit = await credit.save();
                    return res.status(200).send(savedCredit);
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