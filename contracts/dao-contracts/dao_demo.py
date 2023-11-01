from beaker import client, localnet, consts
from algosdk.transaction import PaymentTxn, AssetOptInTxn
from algosdk.atomic_transaction_composer import TransactionWithSigner
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
    check_is_member
)

from proposal import (
    proposal_app,
    get_aggree_counter,
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

## Add member

dao_app_client.fund(2000)
dao_app_client.call(add_members, new_members=[member.address], suggested_params=sp)

## check is_member

check_is_member_request = dao_app_client.call(check_is_member, address=member.address)

print("Is added member:", check_is_member_request.return_value)

exit()

# 4. Create new proposal

ptxn = PaymentTxn(
        proposer.address,
        sp,
        dao_app_client.app_addr,
        dao_app.state.new_proposal_min_balance.value,
)

print("Proposal creation minimum balance:", dao_app.state.new_proposal_min_balance.value)

create_proposal_req = dao_app_client.call(
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

dao_app_client.call(vote, proposal_app_id=proposal_app_id, agree=1)

# 5. Voting

proposal_app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=proposal_app,
    app_id=proposal_app_id,
    signer=sender.signer
)

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
    proposer=sender.address
)

print("DAO app account Algo - After: ", dao_app_client.get_application_account_info().get("amount"))