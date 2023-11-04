from pyteal import *
from beaker import *

class ProposalState:
    owner = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Owner address"
    )
    dao_app_id = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="DAO app id"
    )

    dao_app_address = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="DAO app address"
    )

    dao_token = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="DAO token"
    )

    title = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Proposal title"
    )

    start_time = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="When voting is started"
    )

    end_time = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="When voting is ended"
    )

    allow_early_execution = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Whether this proposal can be excuted early"
    )

    allow_early_repay = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Whether this proposal can be excuted early"
    )

    borrow_amount = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Borrow amount"
    )

    interest_rate = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Borrow rate"
    )

    term = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Repay term",
        default=Int(1) # in months
    )

    is_executed = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Whether this proposal executed",
    )

    is_repaid = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Whether this proposal executed",
    )

    executed_at = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="When this proposal is executed"
    )

    agree_counter = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Agree counter",
    )

    disagree_counter = GlobalStateValue(
        stack_type=TealType.uint64,
        descr="Disagree counter",
    )

    is_voted = LocalStateValue(
        stack_type=TealType.uint64,
        descr="Where member is voted"
    )

proposal_app = Application(
    "ProposalContract",
    state=ProposalState(),
)


@proposal_app.create
def create(
    owner: abi.Address,
    dao_app_id: abi.Uint64, 
    dao_app_address: abi.Address,
    title: abi.String, 
    start_time: abi.Uint64,
    end_time: abi.Uint64,
    allow_early_execution: abi.Uint64,
    allow_early_repay: abi.Uint64,
    borrow_amount: abi.Uint64,
    interest_rate: abi.Uint64,
    term: abi.Uint64,
    dao_token: abi.Uint64
    ) -> Expr:
    return Seq(
        proposal_app.state.owner.set(owner.get()),
        proposal_app.state.dao_app_id.set(dao_app_id.get()),
        proposal_app.state.dao_app_address.set(dao_app_address.get()),
        proposal_app.state.title.set(title.get()),
        proposal_app.state.start_time.set(start_time.get()),
        proposal_app.state.end_time.set(end_time.get()),
        proposal_app.state.allow_early_execution.set(allow_early_execution.get()),
        proposal_app.state.allow_early_repay.set(allow_early_repay.get()),
        proposal_app.state.borrow_amount.set(borrow_amount.get()),
        proposal_app.state.interest_rate.set(interest_rate.get()),
        proposal_app.state.term.set(term.get()), 
        proposal_app.state.agree_counter.set(Int(0)),
        proposal_app.state.disagree_counter.set(Int(0)),
        proposal_app.state.is_executed.set(Int(0)),
        proposal_app.state.is_repaid.set(Int(0)),
        proposal_app.state.dao_token.set(dao_token.get())
    )

@proposal_app.opt_in
def opt_in() -> Expr:
    return Seq(
        
    )

@proposal_app.external(authorize= Authorize.only(proposal_app.state.dao_app_address.get()))
def vote(voter: abi.Account, agree: abi.Uint64, *, output: abi.Uint64) -> Expr:
    return Seq(
        Assert(proposal_app.state.is_voted[voter.address()].get() != Int(1)),
        Assert(Global.latest_timestamp() >= proposal_app.state.start_time.get()),
        Assert(Global.latest_timestamp() <= proposal_app.state.end_time.get()),
        Assert(proposal_app.state.is_executed.get() == Int(0)),
        If(agree.get() == Int(0)).Then(
            proposal_app.state.disagree_counter.increment()
        ).Else(
            proposal_app.state.agree_counter.increment()
        ),
        proposal_app.state.is_voted[voter.address()].set(Int(1)),
        output.set(Int(1))
    )

@proposal_app.external(authorize= Authorize.only(proposal_app.state.dao_app_address.get()))
def execute(quorum: abi.Uint64, passing_threshold: abi.Uint64, count_member: abi.Uint64, borrow_amount: abi.Uint64, proposer: abi.Address, *, output: abi.Uint64) -> Expr:
    return Seq(
        Assert(count_member.get() > Int(0)),
        Assert(proposal_app.state.borrow_amount.get() == borrow_amount.get()),
        Assert(proposal_app.state.is_executed.get() == Int(0)),
        If(proposal_app.state.allow_early_execution.get() == Int(0)).Then(
            Assert(Global.latest_timestamp() >= proposal_app.state.end_time.get())
        ).Else(
            Assert(Int(1))
        ),
        Assert(is_passed(quorum, passing_threshold, count_member) == Int(1)),
        Assert(proposal_app.state.owner.get() == proposer.get()),
        proposal_app.state.is_executed.set(Int(1)),
        proposal_app.state.executed_at.set(Global.latest_timestamp()),
        output.set(Int(1))
    )

@proposal_app.external(authorize=Authorize.only(proposal_app.state.dao_app_address.get()))
def repay(repay_amount: abi.Uint64, owner: abi.Address) -> Expr:
    return Seq(
        Assert(proposal_app.state.owner.get() == owner.get()),
        Assert(proposal_app.state.is_executed.get() == Int(1)),
        Assert(proposal_app.state.is_repaid.get() == Int(0)),
        Assert(repay_amount.get() >= proposal_app.state.borrow_amount.get() * (Int(10000) + proposal_app.state.interest_rate.get()) / Int(10000), comment="amount < repay amount"),
        # check time contraints, check allowing repay
        If(proposal_app.state.allow_early_repay.get() == Int(0)).Then(
            Assert(Global.latest_timestamp() >= (proposal_app.state.executed_at.get() + proposal_app.state.term.get() * Int(30) * Int(24) * Int(3600)), comment="Not repay time")
        ).Else(
            Assert(Global.latest_timestamp() >= proposal_app.state.executed_at.get(), comment="< executed time")
        ),
        proposal_app.state.is_repaid.set(Int(1))
    )

@proposal_app.external
def get_aggree_counter(*, output: abi.Uint64):
    return output.set(proposal_app.state.agree_counter.get())

@Subroutine(TealType.uint64)
def is_passed(quorum: abi.Uint64, passing_threshold: abi.Uint64, count_member: abi.Uint64) -> Expr:
    count_all_votes = proposal_app.state.agree_counter.get() + proposal_app.state.disagree_counter.get()
    return And(
        passing_threshold.get() <= proposal_app.state.agree_counter.get() * Int(100) / count_all_votes,
        quorum.get() <= count_all_votes * Int(100) / count_member.get()
    )
    

