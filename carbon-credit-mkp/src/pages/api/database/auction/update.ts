import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Auction from "src/database/models/auction";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            credit_app_id,
            auction_index
        } = req.body;
        if (credit_app_id) {
            try {
                await Auction.findOneAndUpdate({credit_app_id: credit_app_id, auction_index: auction_index}, req.body);
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