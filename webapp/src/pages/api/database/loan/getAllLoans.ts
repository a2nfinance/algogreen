import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Loan from "src/database/models/loan";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        let loans = await Loan.find().sort({ created_at: -1 });
        return res.status(200).send(loans);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message);
    }


};

export default connect(handler);