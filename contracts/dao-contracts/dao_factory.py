from pyteal import *
from beaker import *

import dao

# class DAOFactoryState:
#     status = GlobalStateValue(
#         stack_type=TealType.uint64,
#         descr="Status of the DAOFactory contract",
#         default=Int(1)
#     )


dao_factory_app = Application(
    "DAOFactory"
    # state=DAOFactoryState()
)
# .apply(
#     unconditional_create_approval,
#     initialize_global_state=True
# )

@dao_factory_app.external
def createDAO(*, output: abi.Uint64) -> Expr:
    dao_pc = precompiled(dao.dao_app)
    sender = Txn.sender()
    return Seq(
        InnerTxnBuilder.Execute({
            **dao_pc.get_create_config(),
            TxnField.application_args: [
                Bytes(dao.create.method_spec().get_selector()),
                sender
            ]
        }),
        output.set(InnerTxn.created_application_id())
    )