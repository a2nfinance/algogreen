import { DaoFromDB } from "src/controller/dao/daoDetailSlice";


export const useProposal = () => {
    const checkPass = (daoFromDB: DaoFromDB, onchainDAO: any[], onchainProposal: any) => {
        let countMember = onchainDAO.filter(d => d.key === "count_member")[0].value;

        const passingThreshold = daoFromDB.passing_threshold;
        const quorum = daoFromDB.quorum;
        const agreeCounter = onchainProposal.filter(p => p.key === "agree_counter")[0].value;
        const disagreeCounter = onchainProposal.filter(p => p.key === "disagree_counter")[0].value;
        const isPassThreshold = (agreeCounter / (agreeCounter + disagreeCounter)) >= passingThreshold/100;
        const isPassQuorum = ((agreeCounter + disagreeCounter) / countMember) >= quorum/100;
        return (isPassThreshold && isPassQuorum);
    }

    return { checkPass };
}