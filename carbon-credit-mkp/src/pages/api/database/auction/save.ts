import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Auction from "src/database/models/auction";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // need to validate
            const {
                buyer,
                credit_app_id,
            } = req.body;
            if (
                buyer
                && credit_app_id
                ) {
                try {
                    let auction = new Auction(req.body);
                    let savedAuction = await auction.save();
                    return res.status(200).send(savedAuction);
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