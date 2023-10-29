from algosdk.transaction import AssetOptInTxn, PaymentTxn
from algosdk.atomic_transaction_composer import TransactionWithSigner
from algosdk.encoding import decode_address, encode_address

from beaker import client, localnet, consts
from dao import (
    dao_app,
    bootstrap,
    #add_member,
    get_owner
)


def print_boxes(app_client: client.ApplicationClient) -> None:
    boxes = app_client.get_box_names()
    print(f"{len(boxes)} boxes found")
    for box_name in boxes:
        contents = app_client.get_box_contents(box_name)
        if box_name == b"members":
            membership_record = contents
            print(f"\t{encode_address(box_name)} => {membership_record} ")
           


# dao_factory_app.build().export("./artifacts/dao")

accounts = localnet.kmd.get_accounts()
sender = accounts[0]

app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=dao_app,
    sender=sender.address,
    signer=sender.signer
)



app_id, addr, txid = app_client.create(owner=sender.address)

print("App ID: ", app_id)

# app_client.fund(1 * consts.algo)

owner = app_client.call(get_owner).return_value

print(owner)
# print("Bootstrapping app")
# sp = app_client.get_suggested_params()
# sp.flat_fee = True
# sp.fee = 2000
# ptxn = PaymentTxn(
#         sender.address,
#         sp,
#         app_client.app_addr,
#         dao_app.state.minimum_balance.value,
# )

# result2 = app_client.call(bootstrap, seed=TransactionWithSigner(ptxn, sender.signer), token_name="newtoken")
# membership_token = result2.return_value
# print("Token app id:", membership_token)

# # Add member
# app_client.client.send_transaction(
#         AssetOptInTxn(sender.address, sp, membership_token).sign(
#             sender.private_key
#         )
#     )
# app_client.call(
#     add_member,
#     new_member=sender.address,
#     suggested_params=sp,
#     boxes=[(app_client.app_id, decode_address(sender.address))],
#     )

# print_boxes(app_client)

