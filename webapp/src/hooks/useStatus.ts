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