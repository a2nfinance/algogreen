from beaker import *
from pyteal import *

from beaker.lib.storage import BoxList, BoxMapping


from beaker.consts import (
    ASSET_MIN_BALANCE,
    BOX_BYTE_MIN_BALANCE,
    BOX_FLAT_MIN_BALANCE,
    FALSE,
)
class DAOState:
    title = GlobalStateValue(
        stack_type=TealType.bytes,

    )

    passing_threshold = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="The proportion of those who voted on a proposal who must vote 'Aggree' for it to pass."
    )
    
    quorum = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="The minimum percentage of voting power that must vote on a proposal for it to be considered."
    )

    proposal_submission_policy = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Who is allowed to submit proposals to the DAO?"
    )

    membership_token = GlobalStateValue(
        stack_type=TealType.uint64,
        static=True,
        descr="The asset that represents membership of this DAO"
    )
    
    count_member = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Count number of members"
    )

    def __init__(self):
        self.minimum_balance = Int(
            6 * ASSET_MIN_BALANCE  # Cover min bal for member token
        )


dao_app = Application(
    "CustomDAO",
    state=DAOState(),
    # build_options=BuildOptions(scratch_slots=False),
)

@dao_app.create
def create(owner: abi.Address) -> Expr:
    return Seq(
        App.globalPut(Bytes("Creator"), owner.get())
        # dao_app.state.owner.set(owner.get())
    )

@dao_app.external(authorize=Authorize.only_creator())
def bootstrap(
    seed: abi.PaymentTransaction,
    token_name: abi.String,
    *,
    output: abi.Uint64,
) -> Expr:
    """create membership token and receive initial seed payment"""
    return Seq(
        Assert(
            seed.get().receiver() == Global.current_application_address(),
            comment="payment must be to app address",
        ),
        Assert(
            seed.get().amount() >= dao_app.state.minimum_balance,
            comment=f"payment must be for >= {dao_app.state.minimum_balance.value}",
        ),

        InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetConfig,
                TxnField.config_asset_name: token_name.get(),
                TxnField.config_asset_total: Int(1000),
                TxnField.config_asset_default_frozen: Int(1),
                TxnField.config_asset_manager: Global.current_application_address(),
                TxnField.config_asset_clawback: Global.current_application_address(),
                TxnField.config_asset_freeze: Global.current_application_address(),
                TxnField.config_asset_reserve: Global.current_application_address(),
                TxnField.fee: Int(0),
            }
        ),
        dao_app.state.membership_token.set(InnerTxn.created_asset_id()),
        output.set(dao_app.state.membership_token),
    )

@dao_app.external(authorize=Authorize.only_creator())
def add_member(
    new_member: abi.Account
) -> Expr:
    return Seq(
        dao_app.state.count_member.increment(),
        InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: dao_app.state.membership_token,
                TxnField.asset_amount: Int(1),
                TxnField.asset_receiver: new_member.address(),
                TxnField.fee: Int(0),
                TxnField.asset_sender: Global.current_application_address(),
            }
        ),
        
    )

# @dao_app.external
# def create_proposal(title: abi.String,*, output: abi.Uint64):
#     proposal_pc = precompiled(proposal.proposal_app)
#     return Seq(
#         InnerTxnBuilder.Execute({
#             **proposal_pc.get_create_config(),
#             TxnField.application_args: [
#                 Bytes(proposal.create.method_spec().get_selector()),
#                 # Global.current_application_id(),
#                 title.get()
#             ]
#         }),
#         output.set(InnerTxn.created_application_id())
#     )

# @dao_app.external
# def create_loan(*, output: abi.Uint64):
#     return Seq(
#         output.set(Int(0))
#     )

@dao_app.external(read_only=True)
def get_owner(*, output: abi.Address):
    return output.set(App.globalGet(Bytes("Creator")))

# @dao_app.external
# def is_member(*, output: abi.Uint8):
#     return output.set(dao_app.state.members[Txn.sender()])