# v0.1.0
# { "Depends": "py-genlayer:latest" }

from genlayer import *

# 1. Definisikan Interface agar DEX tahu cara bicara dengan X-COIN
class IXCoin:
    @gl.public.write
    def transfer(self, amount: int, to_address: str) -> None:
        pass

class Contractdex(gl.Contract):
    def __init__(self):
        # Alamat ContractX (X-COIN) yang sudah kamu deploy
        self.x_coin_address = Address("0x5b9B9167180c3dD0f423cbCe6a6a5EfDcfB7cbeb")
        self.gold_balances = TreeMap[Address, u256]

    @gl.public.write
    def swap(self, amount: int):
        # --- PROSES LINK CONTRACT ---
        # A. Hubungkan ke kontrak X-COIN menggunakan alamat & interface
        x_coin = gl.Contract(self.x_coin_address, interface=IXCoin)
        
        # B. Perintahkan X-COIN untuk transfer token dari user ke DEX ini
        # Dalam skenario ini, kita asumsikan DEX bertindak sebagai penerima swap
        x_coin.transfer(amount, gl.message.contract_address.as_hex)
        
        # --- PROSES INTERNAL DEX ---
        # C. Update saldo GOLD (token hasil swap) di dalam DEX
        current_val = self.gold_balances.get(gl.message.sender_address, u256(0))
        self.gold_balances[gl.message.sender_address] = u256(int(current_val) + amount)

    @gl.public.view
    def get_balance(self, account: str) -> int:
        return int(self.gold_balances.get(Address(account), u256(0)))