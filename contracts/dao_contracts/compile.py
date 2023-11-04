# from beaker import localnet, client
from algosdk.v2client import algod
from dao import (
    dao_app
)

algod_address = "https://testnet-api.algonode.network"
algod_token = "a" * 64
algod_client = algod.AlgodClient(algod_token, algod_address)
if __name__ == "__main__":
    dao_app_spec = dao_app.build(algod_client).export("../artifacts/dao")