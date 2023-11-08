// 0: pending, 1: auditing, 2: approved & deployed contract, 3: rejected, 4: on marketplace
export const useStatus = () => {
    const getCreditStatus = (status: number) => {
        let text = "pending";
        switch (status) {
            case 1:
                text = "auditing";
                break;
            case 2:
                text = "approved";
                break;
            case 3:
                text = "rejected";
                break;
            case 4:
                text = "on marketplace"
            default:
                break;
        }
        return text;
    }
    return {getCreditStatus};
};