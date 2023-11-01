from pyteal import *
from beaker import *
from beaker.lib.storage import BoxMapping
from beaker.consts import (
    ASSET_MIN_BALANCE,
    BOX_BYTE_MIN_BALANCE,
    BOX_FLAT_MIN_BALANCE,
    FALSE,
)

# NamedTuple we'll store in a box per auction
class AuctionRecord(abi.NamedTuple):
    buyer: abi.Field[abi.Address]
    quantity: abi.Field[abi.Uint64]
    price: abi.Field[abi.Uint64]
    status: abi.Field[abi.Uint64] # 0: init, 1: accepted, 2: completed

class MarketplaceState:   
    asset_id = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="NFT Asset id"
    )
    total_credits = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Total Credit"
    )
    seller = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Seller Address"
    )

    origin_price = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Original price"
    )
    allow_auction = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Allow user creating auction"
    )

    max_auction_number = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Maximum number of existing auctions"
    )
    
    auctions_counter = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Count how many created autction"
    )

   

    def __init__(self, *, max_number: int, record_type: type[abi.BaseType]):
        self.max_auction_number.set(Int(max_number))
        self.auctions = BoxMapping(abi.Uint64, record_type)
        self.minimum_balance = Int(
            ASSET_MIN_BALANCE 
            +
            (
                BOX_FLAT_MIN_BALANCE
                + (abi.size_of(record_type) * BOX_BYTE_MIN_BALANCE)
                + (abi.size_of(abi.Uint64) * BOX_BYTE_MIN_BALANCE)
            ) * max_number
        )

mkp_app = Application(
    "Carbon Credit Selling Contract",
    state=MarketplaceState(max_number=10, record_type=AuctionRecord),
    build_options=BuildOptions(scratch_slots=False),
)

@mkp_app.create
def create(seller: abi.Address, total_credits: abi.Uint64) -> Expr:
    return Seq(
        mkp_app.state.seller.set(seller.get()),
        mkp_app.state.auctions_counter.set(Int(0)),
        mkp_app.state.total_credits.set(total_credits.get())
    )

@mkp_app.external(authorize=Authorize.only(mkp_app.state.seller.get()))
def bootstrap(
    seed: abi.PaymentTransaction, 
    allow_or_not: abi.Uint64, 
    max_number: abi.Uint64, 
    origin_price: abi.Uint64, 
    asset_name: abi.String,
    asset_url: abi.String,
    *, 
    output: abi.Uint64) -> Expr:
    return Seq(
        Assert(
            seed.get().receiver() == Global.current_application_address(),
            comment="payment must be to app address",
        ),
        Assert(
            seed.get().amount() >= mkp_app.state.minimum_balance,
            comment=f"payment must be for >= {mkp_app.state.minimum_balance.value}",
        ),
        mkp_app.state.allow_auction.set(allow_or_not.get()),
        mkp_app.state.max_auction_number.set(max_number.get()),
        mkp_app.state.origin_price.set(origin_price.get()),
        InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetConfig,
                TxnField.config_asset_total: mkp_app.state.total_credits.get(),
                TxnField.config_asset_decimals: Int(0),
                TxnField.config_asset_unit_name: Bytes("cc"),
                TxnField.config_asset_name: asset_name.get(),
                TxnField.config_asset_url: asset_url.get(),
                TxnField.config_asset_manager: Global.current_application_address(),
                TxnField.config_asset_reserve: Global.current_application_address(),
                TxnField.config_asset_freeze: Global.current_application_address(),
                TxnField.config_asset_clawback: Global.current_application_address(),
            }
        ),
        mkp_app.state.asset_id.set(InnerTxn.created_asset_id()),
        output.set(mkp_app.state.asset_id)
    )

@mkp_app.external(authorize=Authorize.only(mkp_app.state.seller.get()))
def set_allow_auction(allow_or_not: abi.Uint64, *, output: abi.Uint64) -> Expr:
    return Seq(
        mkp_app.state.allow_auction.set(allow_or_not.get()),
        output.set(allow_or_not.get())
    )

@mkp_app.external(authorize=Authorize.only(mkp_app.state.seller.get()))
def set_max_auction_number(max_number: abi.Uint64, *, output: abi.Uint64) -> Expr:
    return Seq(
        mkp_app.state.max_auction_number.set(max_number.get()),
        output.set(max_number.get())
    )

@mkp_app.external
def create_auction(quantity: abi.Uint64, price: abi.Uint64, *, output: abi.Uint64) -> Expr:
    return Seq(
        Assert(mkp_app.state.allow_auction.get() == Int(1)),
        (status:= abi.Uint64()).set(Int(0)),
        (address:= abi.Address()).set(Txn.sender()),
        (a := AuctionRecord()).set(address, quantity, price, status),
        (key:= abi.Uint64()).set(mkp_app.state.auctions_counter.get()),
        mkp_app.state.auctions[key].set(a),
        mkp_app.state.auctions_counter.increment(),
        output.set(mkp_app.state.auctions_counter.get())
    )

@mkp_app.external(authorize=Authorize.only(mkp_app.state.seller.get()))
def accept_auction(key: abi.Uint64, *, output: abi.Uint64) -> Expr:
    return Seq(
        Assert(mkp_app.state.allow_auction.get() == Int(1)),
        (a:= AuctionRecord()).decode(mkp_app.state.auctions[key].get()),
        (status:= abi.Uint64()).set(a.status),
        (buyer:= abi.Address()).set(a.buyer),
        (quantity:= abi.Uint64()).set(a.quantity),
        (price:= abi.Uint64()).set(a.price),
        Assert(status.get() == Int(0)),
        status.set(Int(1)),
        a.set(buyer, quantity, price, status),
        mkp_app.state.auctions[key].set(a),
        output.set(Int(1))
    )

@mkp_app.external(authorize=Authorize.only(mkp_app.state.seller.get()))
def remove_auction(key: abi.Uint64, *, output: abi.Uint64) -> Expr:
    return Seq(
        (a:= AuctionRecord()).decode(mkp_app.state.auctions[key].get()),
        (status:= abi.Uint64()).set(a.status),
        Assert(status.get() == Int(0)),
        Pop(mkp_app.state.auctions[key].delete()),
        output.set(key.get())
    )

@mkp_app.external
def do_buy_with_auction(
    payment: abi.PaymentTransaction, 
    key: abi.Uint64, 
    asset_id: abi.Asset = mkp_app.state.asset_id,  # type: ignore[assignment],
    seller: abi.Account = mkp_app.state.seller, # type: ignore[assignment],
    *, 
    output: abi.Uint64
    ) -> Expr:
    return Seq(
        Assert(mkp_app.state.allow_auction.get() == Int(1)),
        Assert(
            payment.get().receiver() == Global.current_application_address(),
            comment="payment must be to app address",
        ),
        (a:= AuctionRecord()).decode(mkp_app.state.auctions[key].get()),
        (status:= abi.Uint64()).set(a.status),
        (buyer:= abi.Address()).set(a.buyer),
        (quantity:= abi.Uint64()).set(a.quantity),
        (price:= abi.Uint64()).set(a.price),
        Assert(status.get() == Int(1)),
        Assert(Txn.sender() == buyer.get()),
        Assert(
            payment.get().amount() >= price.get(),
            comment=f"payment must be for >= {price.get()}",
        ),
        # Check asset balance
        # Inner transactions
        ## Send NFT asset amount to the buyer (must opted-in)
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: mkp_app.state.asset_id,
                TxnField.asset_amount: quantity.get(),
                TxnField.asset_receiver: buyer.get(),
                # TxnField.fee: Int(0),
                TxnField.asset_sender: Global.current_application_address(),
            }
        ),
        InnerTxnBuilder.Next(),
        # Send Algo token amount to the seller
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: mkp_app.state.seller.get(),
                TxnField.amount: price.get(),
            }
        ),
        InnerTxnBuilder.Submit(),
        status.set(Int(2)),
        a.set(buyer, quantity, price, status),
        mkp_app.state.auctions[key].set(a),
        output.set(Int(2))
    )

@mkp_app.external
def do_buy_without_auction(
    payment: abi.PaymentTransaction, 
    asset_id: abi.Asset = mkp_app.state.asset_id,  # type: ignore[assignment]
    *, 
    output: abi.Uint64
    ) -> Expr:
    return Seq(
        Assert(
            payment.get().receiver() == Global.current_application_address(),
            comment="payment must be to app address",
        ),
        Assert(
            payment.get().amount() >= mkp_app.state.origin_price.get(),
            comment=f"payment must be for >= {mkp_app.state.origin_price.get()}",
        ),
        # Send NFT token
        InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: mkp_app.state.asset_id,
                TxnField.asset_amount: mkp_app.state.total_credits.get(),
                TxnField.asset_receiver: Txn.sender(),
                # TxnField.fee: Int(0),
                TxnField.asset_sender: Global.current_application_address(),

            }
        ),
        output.set(Int(1))

    )

@mkp_app.external
def get_auction_record(
    key: abi.Uint64, *, output: AuctionRecord
) -> Expr:
    return mkp_app.state.auctions[key].store_into(output)


@mkp_app.external(authorize=Authorize.only(mkp_app.state.seller.get()))
def withdraw(amount: abi.Uint64) -> Expr:
    return Seq(
        InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: mkp_app.state.seller.get(),
                TxnField.amount: amount.get(),
            }
        ),
    )