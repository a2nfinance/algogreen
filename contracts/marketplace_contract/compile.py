# from beaker import localnet, client
from algosdk.v2client import algod
from cc_marketplace import (
    mkp_app
)
algod_address = "https://testnet-api.algonode.network"
algod_token = "a" * 64
algod_client = algod.AlgodClient(algod_token, algod_address)
if __name__ == "__main__":
    mkp_app_spec = mkp_app.build(algod_client).export("../artifacts/marketplace")