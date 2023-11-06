from beaker import *
from pyteal import *

import proposal

from beaker.consts import (
    ASSET_MIN_BALANCE
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
            100000 + ASSET_MIN_BALANCE 
        )
        self.new_proposal_min_balance = Int(
            100000 + 
            + (25000 + 3500)*15
            + (25000 + 25000)*3
        )


dao_app = Application(
    "CustomDAO",
    state=DAOState()
)

@dao_app.create
def create(
    title: abi.String, 
    passing_threshold: abi.Uint64, 
    quorum: abi.Uint64,
    proposal_submission_policy: abi.Uint64
    ) -> Expr:
    return Seq(
        dao_app.state.title.set(title.get()),
        dao_app.state.passing_threshold.set(passing_threshold.get()),
        dao_app.state.quorum.set(quorum.get()),
        dao_app.state.proposal_submission_policy.set(proposal_submission_policy.get())
    )

@dao_app.external(authorize=Authorize.only_creator())
def bootstrap(
    seed: abi.PaymentTransaction,
    token_name: abi.String,
    token_supply: abi.Uint64,
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
                TxnField.config_asset_unit_name: token_name.get(),
                TxnField.config_asset_total: token_supply.get(),
                TxnField.config_asset_default_frozen: Int(1),
                TxnField.config_asset_manager: Global.current_application_address(),
                TxnField.config_asset_clawback: Global.current_application_address(),
                TxnField.config_asset_freeze: Global.current_application_address(),
                TxnField.config_asset_reserve: Global.current_application_address(),
                TxnField.fee: Int(0),
            }
        ),
        dao_app.state.membership_token.set(InnerTxn.created_asset_id()),
        output.set(dao_app.state.membership_token)
    )

@dao_app.external
def check_is_member(
    address: abi.Account,
    *, 
    output: abi.Uint64
    ) -> Expr:
    return Seq(
        If(is_member(address.address()) == Int(1)).Then(output.set(Int(1))).Else(output.set(Int(0)))
    )

@dao_app.external(authorize=Authorize.only_creator())
def add_new_member(
    new_member: abi.Account,
) -> Expr:
    return Seq(
        Assert(is_member(new_member.address()) == Int(0)),
        send_asset(new_member.address()),
        set_asset_freeze(new_member.address(), Int(1)),
        dao_app.state.count_member.increment()
    )

@dao_app.external(authorize=Authorize.only_creator())
def add_members(
    new_members: abi.DynamicArray[abi.Address],
    *,
    output: abi.Uint64
    ) -> Expr:
    index = ScratchVar(TealType.uint64)
    member = abi.Address()
    return Seq(
        For(
            index.store(Int(0)),
            index.load() < new_members.length(),
            index.store(index.load() + Int(1))
        ).Do(
            new_members.__getitem__(index.load()).store_into(member),
            add_member(
                member.get()
            )
        ),
        output.set(new_members.length())
    )

@dao_app.external
def create_proposal(
    seed: abi.PaymentTransaction,
    title: abi.String, 
    start_time: abi.Uint64,
    end_time: abi.Uint64,
    allow_early_execution: abi.Uint64,
    allow_early_repay: abi.Uint64,
    borrow_amount: abi.Uint64,
    interest_rate: abi.Uint64,
    term: abi.Uint64,
    *, 
    output: abi.Uint64
    ) -> Expr:
    proposal_pc = precompiled(proposal.proposal_app)
    sender = Txn.sender()
    return Seq(
        # Check proposal submission policy
        If(dao_app.state.proposal_submission_policy.get() == Int(0)).Then(
             Assert(is_member(sender) == Int(1))
        ).Else(Assert(Int(1) == Int(1))),
        Assert(
            seed.get().receiver() == Global.current_application_address(),
            comment="payment must be to app address",
        ),
        Assert(
            seed.get().amount() >= dao_app.state.new_proposal_min_balance,
            comment=f"payment must be for >= {dao_app.state.new_proposal_min_balance.value}",
        ),
        InnerTxnBuilder.Execute({
            **proposal_pc.get_create_config(),
            TxnField.application_args: [
                Bytes(proposal.create.method_spec().get_selector()),
                sender,
                Itob(Global.current_application_id()),
                Global.current_application_address(),
                title.get(),
                Itob(start_time.get()),
                Itob(end_time.get()),
                Itob(allow_early_execution.get()),
                Itob(allow_early_repay.get()),
                Itob(borrow_amount.get()),
                Itob(interest_rate.get()),
                Itob(term.get()),
                Itob(dao_app.state.membership_token.get())
            ]
        }),
        output.set(InnerTxn.created_application_id())
    )

@dao_app.external
def vote(
    proposal_app_id: abi.Uint64, 
    agree: abi.Uint64,
    *,
    output: abi.Uint64
    ) -> Expr:
    sender = Txn.sender()
    return Seq(
        # Check member
        Assert(is_member(sender) == Int(1)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.MethodCall(
            app_id=proposal_app_id.get(),
            method_signature=proposal.vote.method_signature(),
            args=[
                sender,
                agree
            ],
        ),
        InnerTxnBuilder.Submit(),
        output.set(agree)
    )

@dao_app.external
def execute_proposal(
    proposal_app_id: abi.Uint64, 
    borrow_amount: abi.Uint64,
    proposer: abi.Address
    ) -> Expr:
    return Seq(
        Assert(Balance(Global.current_application_address()) >= borrow_amount.get() + MinBalance(Global.current_application_address()) + Global.min_txn_fee()),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.MethodCall(
            app_id=proposal_app_id.get(),
            method_signature=proposal.execute.method_signature(),
            args=[
                Itob(dao_app.state.quorum.get()), 
                Itob(dao_app.state.passing_threshold.get()), 
                Itob(dao_app.state.count_member.get()),
                Itob(borrow_amount.get()),
                proposer.get()
            ],
        ),
        InnerTxnBuilder.Submit(),
        InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: proposer.get(),
                TxnField.amount: borrow_amount.get(),
            }
        )
    )

@dao_app.external
def repay_proposal(
    repay_txn: abi.PaymentTransaction,
    proposal_app_id: abi.Uint64
    ) -> Expr:
    return Seq(
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.MethodCall(
            app_id=proposal_app_id.get(),
            method_signature=proposal.repay.method_signature(),
            args=[
                Itob(repay_txn.get().amount()),
                Txn.sender()
            ],
        ),
        InnerTxnBuilder.Submit(),
    )

@dao_app.external
def get_minimum_balance(*, output: abi.Uint64) -> Expr:
    return output.set(MinBalance(Global.current_application_address()))

@dao_app.external(authorize=Authorize.only_creator())
def withdraw(amount: abi.Uint64, *, output: abi.Uint64) -> Expr:
    balance= Balance(Global.current_application_address())
    return Seq(
        Assert(balance >= amount.get() + MinBalance(Global.current_application_address()) + Global.min_txn_fee()),
        InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Global.creator_address(),
                TxnField.amount: amount.get(),
            }
        ),
        output.set(amount.get())
    )

## Subroutines

@Subroutine(TealType.none)
def add_member(
    new_member: Expr,
) -> Expr:
    return Seq(
        # Sure that the new member doesn't exist
        Assert(is_member(new_member) == Int(0)),
        send_asset(new_member),
        set_asset_freeze(new_member, Int(1)),
        dao_app.state.count_member.increment(),
    )

@Subroutine(TealType.uint64)
def is_member(address: Expr) -> Expr:
    assetbalance = AssetHolding.balance(address, dao_app.state.membership_token.get())
    return Seq(
        assetbalance,
        Return(And(
            assetbalance.hasValue(),
            assetbalance.value() > Int(0)
    )))
    

@Subroutine(TealType.none)
def send_asset(address: Expr):
    return Seq(
       InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: dao_app.state.membership_token,
                TxnField.asset_amount: Int(1),
                TxnField.asset_receiver: address,
                # TxnField.fee: Int(0),
                TxnField.asset_sender: Global.current_application_address()
            }
        )
    )

@Subroutine(TealType.none)
def set_asset_freeze(address: Expr, frozen: Expr) -> Expr:
    return Seq([
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetFreeze,
            TxnField.freeze_asset_account: address,
            TxnField.freeze_asset_frozen: frozen,
            TxnField.freeze_asset: dao_app.state.membership_token,
        }),
        InnerTxnBuilder.Submit(),
    ])