import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Credit from "src/database/models/credit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        try {
            let credit = await Credit.find().sort({ created_at: -1 });
            return res.status(200).send(credit);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message);
        }

    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);