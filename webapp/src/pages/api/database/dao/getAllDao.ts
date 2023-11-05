import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import DAO from "src/database/models/DAO";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            status
        } = req.body;
        if (status) {

            try {
                let daos = await DAO.find({ status: status }).sort({created_at: -1});
                return res.status(200).send(daos);
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