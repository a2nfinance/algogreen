from algosdk.abi import ABIType
from beaker import client, localnet, consts
from algosdk.transaction import PaymentTxn, AssetOptInTxn
from algosdk.atomic_transaction_composer import TransactionWithSigner
from cc_marketplace import (
    mkp_app,
    bootstrap,
    accept_auction,
    create_auction,
    remove_auction,
    do_buy_with_auction,
    do_buy_without_auction,
    AuctionRecord,
    get_auction_record,
    withdraw
)


record_codec = ABIType.from_string(str(AuctionRecord().type_spec()))

def print_boxes(app_client: client.ApplicationClient) -> None:
    boxes = app_client.get_box_names()
    print(f"{len(boxes)} boxes found")
    for box_name in boxes:
        contents = app_client.get_box_contents(box_name)
        auction_record = record_codec.decode(contents)
        print(f"\t{box_name} => {auction_record} ")


# 1.Initialize testing accounts
accounts = localnet.kmd.get_accounts()
## admin
acct0 = accounts[0]
## seller
acct1 = accounts[1]
## buyer
acct2 = accounts[2]

## Algo app client
algod_client = localnet.get_algod_client()

# 2.====================================================================
## Admin create a cc_marketplace_contract
## MK app client
app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=mkp_app,
    sender=acct0.address,
    signer=acct0.signer
)

mkp_app_id, dao_addr, _ = app_client.create(seller=acct1.address, total_credits=1000)
print("Marketplace app id: ", mkp_app_id)

# 3.=====================================================================
## seller call bootraps
mkp_app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=mkp_app,
    app_id=mkp_app_id,
    signer=acct1.signer
)
sp = mkp_app_client.get_suggested_params()
sp.flat_fee = True
sp.fee = 2000
ptxn = PaymentTxn(
        acct1.address,
        sp,
        mkp_app_client.app_addr,
        mkp_app.state.minimum_balance.value,
)

result2 = mkp_app_client.call(
    bootstrap, 
    seed=TransactionWithSigner(ptxn, acct1.signer), 
    allow_or_not=1, 
    max_number=8, 
    origin_price=100 * consts.algo, 
    asset_name="CC for 1", 
    asset_url="http://google.com"
)
asset_id = result2.return_value
print("Token app id:", asset_id)

## op-in
app_client.client.send_transaction(
    AssetOptInTxn(acct1.address, sp, asset_id).sign(
        acct1.private_key
    )
) 
# 4.=====================================================================
## Create an auction
mkp_app_client_buyer = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=mkp_app,
    app_id=mkp_app_id,
    signer=acct2.signer
)
create_auction_req = mkp_app_client_buyer.call(
    create_auction, 
    quantity=10,
    price= 1 * consts.algo,
    boxes=[(app_client.app_id, 0)],
)

print("Auction Index:", create_auction_req.return_value)

# 5.=====================================================================
# Accept an auction

mkp_app_client.call(
    accept_auction, 
    key=0,
    boxes=[(app_client.app_id, 0)]
)

## print_boxes(mkp_app_client)


get_auction_record_req = mkp_app_client.call(
    get_auction_record, 
    key=0,
    boxes=[(app_client.app_id, 0)]
)

print("Accepted Auction:", get_auction_record_req.return_value)


# 6.=====================================================================
## Do buy with an auction
## Opt buyer's accoun into NFT assets.

## Account 2 opting in
## op-in
app_client.client.send_transaction(
    AssetOptInTxn(acct2.address, sp, asset_id).sign(
        acct2.private_key
    )
) 

sp_buyer = mkp_app_client_buyer.get_suggested_params()
ptxn = PaymentTxn(
        acct2.address,
        sp_buyer,
        mkp_app_client_buyer.app_addr,
        1*consts.algo,
)

account_asset_info = algod_client.account_info(acct1.address)
print("Seller Asset Before:", account_asset_info.get("amount"))

do_buy_with_auction_req = mkp_app_client_buyer.call(
    do_buy_with_auction,
    payment=TransactionWithSigner(ptxn, acct2.signer),  
    key=0,
    boxes=[(app_client.app_id, 0)],
)

get_auction_record_req_after_buy = mkp_app_client_buyer.call(
    get_auction_record, 
    key=0,
    boxes=[(app_client.app_id, 0)]
)
print("Completed Auction:", get_auction_record_req_after_buy.return_value)

## Check account 1 / 2 balance

account_asset_info = algod_client.account_asset_info(acct2.address, asset_id)
print("Buyer Asset info:", account_asset_info)

account_asset_info = algod_client.account_info(acct1.address)
print("Seller Asset After:", account_asset_info.get("amount"))
exit()

