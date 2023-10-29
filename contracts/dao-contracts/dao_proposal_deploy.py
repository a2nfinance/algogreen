from beaker import client, localnet, consts
from algosdk.transaction import PaymentTxn
from algosdk.atomic_transaction_composer import TransactionWithSigner
import time
from dao import (
    dao_app,
    bootstrap
)

from proposal import (
    proposal_app,
    get_aggree_counter,
    vote
)


accounts = localnet.kmd.get_accounts()
sender = accounts[0]

# DAO app client
dao_app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=dao_app,
    sender=sender.address,
    signer=sender.signer
)



dao_app_id, dao_addr, _ = dao_app_client.create(owner=sender.address)
print("DAO app id", dao_app_id)

# print("Bootstrapping app")
sp = dao_app_client.get_suggested_params()
sp.flat_fee = True
sp.fee = 2000
ptxn = PaymentTxn(
        sender.address,
        sp,
        dao_app_client.app_addr,
        dao_app.state.minimum_balance.value,
)

result2 = dao_app_client.call(bootstrap, seed=TransactionWithSigner(ptxn, sender.signer), token_name="newtoken")
membership_token = result2.return_value
print("Token app id:", membership_token)

# Proposal app client

proposal_app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=proposal_app,
    sender=sender.address,
    signer=sender.signer
)

proposal_app_id, proposal_addr, _ = proposal_app_client.create(
    dao_app_id=dao_app_id, 
    dao_app_address=dao_addr,
    title= "Test proposal", 
    start_time=0,
    end_time= int(time.time()) + 1000,
    allow_early_execution= 1,
    borrow_amount= 1* consts.algo,
    interest_rate= 9,
    term= 12,
    dao_token=membership_token
)

print("Proposal App ID:", proposal_app_id)


get_agree_before_voting = proposal_app_client.call(get_aggree_counter)

print("Number of agreements before voting: ", get_agree_before_voting.return_value)


# Voting
proposal_app_client.call(vote, agree=1)

get_agree_after_voting = proposal_app_client.call(get_aggree_counter)

print("Number of agreements after voting: ", get_agree_after_voting.return_value)