from algosdk.transaction import AssetOptInTxn, PaymentTxn
from algosdk.atomic_transaction_composer import TransactionWithSigner

from beaker import client, localnet, consts

from dao_factory import (
    dao_factory_app,
    createDAO
)
from dao import (
    dao_app,
    bootstrap,
    get_owner,
    create_proposal
)

# dao_factory_app.build().export("./artifacts/dao_factory")

accounts = localnet.kmd.get_accounts()
sender = accounts[0]

app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=dao_factory_app,
    sender=sender.address,
    signer=sender.signer
)



app_id, addr, txid = app_client.create()

print("App ID: ", app_id)

app_client.fund(1 * consts.algo)

# app_client.call(createDAO)
# app_client.call(set_reserved_app_state_val, k=2, v="Ben")

result1 = app_client.call(createDAO)
dao_app_id = result1.return_value

print("State with key 1: ", result1.return_value)

##
# Bootstrap Club app
##

dao_client =  client.ApplicationClient(
        client=localnet.get_algod_client(),
        app=dao_app,
        signer=sender.signer,
        app_id=dao_app_id,
)

# Creator address
print("Caller address:", sender.address)
result = dao_client.call(get_owner)

print("Owner of DAO:", result.return_value)

print("Bootstrapping app")
sp = app_client.get_suggested_params()
sp.flat_fee = True
sp.fee = 2000
ptxn = PaymentTxn(
        sender.address,
        sp,
        dao_client.app_addr,
        dao_app.state.minimum_balance.value,
)

result3 = dao_client.call(bootstrap, seed=TransactionWithSigner(ptxn, sender.signer), token_name="newtoken")
print("Token app id:", result3.return_value)

result4 = dao_client.call(create_proposal, title="Title")
print("Proposal app id:", result4.return_value)

