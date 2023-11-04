import { NextApiRequest, NextApiResponse } from 'next';
import connect from 'src/database/connect';
import * as fs from "fs";
import { algoClient } from "src/core/constant";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  
        try {
            const approvalProgram = fs.readFileSync(
                "artifacts/marketplace/approval.teal",
                'utf8'
            );
            const clearProgram = fs.readFileSync(
                "artifacts/marketplace/clear.teal",
                'utf8'
            );

            // example: APP_COMPILE
            const approvalCompileResp = await algoClient
                .compile(Buffer.from(approvalProgram))
                .do();

            // const compiledApprovalProgram = new Uint8Array(
            //     Buffer.from(approvalCompileResp.result, 'base64')
            // );

            const clearCompileResp = await algoClient
                .compile(Buffer.from(clearProgram))
                .do();

            // const compiledClearProgram = new Uint8Array(
            //     Buffer.from(clearCompileResp.result, 'base64')
            // );

            // example: APP_SCHEMA
            // define uint64s and byteslices stored in global/local storage
            const numGlobalByteSlices = 1;
            const numGlobalInts = 6;
            const numLocalByteSlices = 0;
            const numLocalInts = 0;
            return res.status(200).send({ 
                    compiledApprovalProgram: approvalCompileResp.result,
                    compiledClearProgram: clearCompileResp.result,
                    numGlobalByteSlices: numGlobalByteSlices,
                    numGlobalInts: numGlobalInts,
                    numLocalByteSlices: numLocalByteSlices,
                    numLocalInts: numLocalInts
             });
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message);
        }
};

export default connect(handler);