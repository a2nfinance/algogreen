from pyteal import *
from beaker import *

class LoanState:
    title = GlobalStateValue(
        stack_type=TealType.bytes,
        descr="Loan title"
    )


loan_app = Application(
    "LoanContract",
    state=LoanState(),
)

@loan_app.create
def create(title: abi.String):
    return Seq(
        loan_app.state.title.set(title.get())
    )