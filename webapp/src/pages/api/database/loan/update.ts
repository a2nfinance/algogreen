import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Loan from 'src/database/models/loan';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            _id,
        } = req.body;
        if (_id) {
            try {
                await Loan.findOneAndUpdate({_id: _id}, req.body);
                res.json({ success: true });
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