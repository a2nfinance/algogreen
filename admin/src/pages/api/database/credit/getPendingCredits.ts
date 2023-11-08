import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Credit from "src/database/models/credit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {


    try {
        let credit = await Credit.find({ status: 0 }).sort({ created_at: -1 });
        return res.status(200).send(credit);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message);
    }


};

export default connect(handler);