import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Loan from 'src/database/models/loan';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            dao_id,
            title,
            start_date,
            end_date,
            maximum_borrow_amount,
            term,
            general_interest_rate,
            special_interest_rate,
            require_collateral,
            allow_early_repay
        } = req.body;
        if (dao_id && title && start_date && end_date && maximum_borrow_amount && term && general_interest_rate && special_interest_rate) {
            try {
                let loan = new Loan(req.body);
                let savedLoan = await loan.save();
                return res.status(200).send(savedLoan);
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