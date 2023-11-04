from beaker import client, localnet, consts
from algosdk.transaction import PaymentTxn, AssetOptInTxn, ApplicationOptInTxn, wait_for_confirmation
from algosdk.atomic_transaction_composer import TransactionWithSigner
from algosdk.encoding import decode_address, encode_address
import time
from dao import (
    create_proposal,
    dao_app,
    bootstrap,
    vote,
    get_minimum_balance,
    execute_proposal,
    add_members,
    add_new_member,
    check_is_member,
    repay_proposal
)

from proposal import (
    proposal_app,
    get_aggree_counter,
    opt_in
    # vote
)

# 1. Initilized testing account
accounts = localnet.kmd.get_accounts()
sender = accounts[0]
member = accounts[1]
proposer = accounts[2]

# 2. Deploy a DAO app
dao_app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=dao_app,
    sender=sender.address,
    signer=sender.signer
)



dao_app_id, dao_addr, _ = dao_app_client.create(title="Test DAO", passing_threshold=20, quorum=50, proposal_submission_policy=1)

print("Created dao app id: ", dao_app_id)


min_balance_req = dao_app_client.call(get_minimum_balance)

min_balance = min_balance_req.return_value

print("Minumum balance:", min_balance)

# 3. Bootstrap DAO app
sp = dao_app_client.get_suggested_params()
sp.flat_fee = True
sp.fee = 2000
ptxn = PaymentTxn(
        sender.address,
        sp,
        dao_app_client.app_addr,
        dao_app.state.minimum_balance.value,
)

result2 = dao_app_client.call(bootstrap, seed=TransactionWithSigner(ptxn, sender.signer), token_name="newtoken", token_supply=100000)
membership_token = result2.return_value
print("Token app id:", membership_token)

# 3. Initalize member start adding members

## Opt member account in to asset
dao_app_client.client.send_transaction(
    AssetOptInTxn(member.address, sp, membership_token).sign(
        member.private_key
    )
)    
dao_app_client.client.send_transaction(
    AssetOptInTxn(sender.address, sp, membership_token).sign(
        sender.private_key
    )
)    
## Add member
dao_app_client.fund(4000)
dao_app_client.call(add_members, new_members=[sender.address, member.address], suggested_params=sp, accounts=[sender.address, member.address], foreign_assets=[membership_token])

## check is_member

check_is_member_request = dao_app_client.call(check_is_member, address=member.address,  foreign_assets=[membership_token])

print("Is added member:", check_is_member_request.return_value)

# 4. Create new proposal

ptxn = PaymentTxn(
        proposer.address,
        sp,
        dao_app_client.app_addr,
        dao_app.state.new_proposal_min_balance.value,
)

print("Proposal creation minimum balance:", dao_app.state.new_proposal_min_balance.value)
dao_app_client_proposer = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=proposal_app,
    app_id=dao_app_id,
    signer=proposer.signer
)
create_proposal_req = dao_app_client_proposer.call(
    create_proposal,
    seed=TransactionWithSigner(ptxn, proposer.signer),
    title= "Test proposal", 
    start_time=0,
    end_time= int(time.time()) + 1000,
    allow_early_execution= 1,
    allow_early_repay= 1,
    borrow_amount= 1* consts.algo,
    interest_rate= 900,
    term= 12
)
proposal_app_id = create_proposal_req.return_value
print("Proposal App ID:", proposal_app_id)

min_balance_req = dao_app_client.call(get_minimum_balance)

min_balance = min_balance_req.return_value

print("Minimum balance after proposal creation:", min_balance)
# 5. Voting
proposal_app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=proposal_app,
    app_id=proposal_app_id,
    signer=member.signer
)

txid = dao_app_client.client.send_transaction(
    ApplicationOptInTxn(sender.address, sp, proposal_app_id, app_args=[opt_in.method_spec().get_selector()]).sign(
        sender.private_key
    )
)   
optin_result = wait_for_confirmation(proposal_app_client.client, txid, 4)
assert optin_result["confirmed-round"] > 0
print("Opted account into proposal app:", proposal_app_id)

print("Before vote:", sender.address)

dao_app_client.call(vote, proposal_app_id=proposal_app_id, agree=1, foreign_apps=[proposal_app_id], foreign_assets=[membership_token])

print("Voted by:", sender.address)
get_agree_after_voting = proposal_app_client.call(get_aggree_counter)

print("Number of agreements after voting: ", get_agree_after_voting.return_value)

proposal_app_account_address = proposal_app_client.get_application_account_info().get("address")

print("Proposal app account info: ", proposal_app_account_address)

# 6. Proposal execution

dao_app_client.fund(1 * consts.algo)

print("DAO app account Algo - Before: ", dao_app_client.get_application_account_info().get("amount"))

execute_and_create_loan = dao_app_client.call(
    execute_proposal, 
    proposal_app_id=proposal_app_id,
    borrow_amount= 1* consts.algo,
    proposer=proposer.address,
    accounts=[proposer.address],
    foreign_apps=[proposal_app_id]
)

print("DAO app account Algo - After: ", dao_app_client.get_application_account_info().get("amount"))

# 7. Repay
ptxn = PaymentTxn(
        proposer.address,
        sp,
        dao_app_client.app_addr,
        int(1.09 * consts.algo),
)

result2 = dao_app_client_proposer.call(repay_proposal, repay_txn=TransactionWithSigner(ptxn, proposer.signer), proposal_app_id=proposal_app_id, foreign_apps=[proposal_app_id])