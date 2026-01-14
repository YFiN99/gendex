# v0.1.0
# { "Depends": "py-genlayer:latest" }

import json
from genlayer import *

class XCoin(gl.Contract):
    balances: TreeMap[Address, u256]

    def __init__(self) -> None:
        initial_supply = 1000000
        self.balances[gl.message.sender_address] = u256(initial_supply)
        # Simpan alamat DEX agar kontrak tahu siapa yang diberi izin khusus
        self.authorized_dex = Address("0xC0D0C6236870F192FBD9503d4F36Fd7eB71567a4")

    @gl.public.write
    def faucet(self) -> None:
        """Fungsi agar orang lain bisa minta koin gratis (misal 1000 koin)"""
        current_bal = self.balances.get(gl.message.sender_address, u256(0))
        self.balances[gl.message.sender_address] = u256(int(current_bal) + 1000)

    @gl.public.write
    def transfer(self, amount: int, to_address: str) -> None:
        # Penambahan Logika Keamanan: 
        # Cek apakah pengirim adalah pemilik koin, ATAU kontrak DEX yang sudah diizinkan
        sender = gl.message.sender_address
        
        # Jika transaksi datang dari DEX, maka 'sender' aslinya adalah user yang memicu DEX tersebut
        # Dalam sistem Intelligent GenLayer, kita bisa membiarkan LLM memvalidasi niatnya
        
        input_data = f"""
        The current balance for all users in JSON format is:
        {json.dumps(self.get_balances())}
        The transaction request is: {{
        sender: "{sender.as_hex}",
        recipient: "{Address(to_address).as_hex}",
        amount: {amount},
        caller_contract: "{gl.message.sender_address.as_hex}"
        }}
        
        Note: If the caller is the authorized DEX {self.authorized_dex.as_hex}, they are allowed to move funds for the user.
        """
        
        task = "Process the transfer. If valid, return the new balances in JSON format under the key 'updated_balances'."
        criteria = "A user can only spend what they have, unless it's a valid swap through the authorized DEX."

        final_result = (
            gl.eq_principle.prompt_non_comparative(
                lambda: input_data,
                task=task,
                criteria=criteria,
            )
            .replace("```json", "")
            .replace("```", "")
        )
        
        result_json = json.loads(final_result)
        for k, v in result_json["updated_balances"].items():
            self.balances[Address(k)] = u256(int(v))

    @gl.public.view
    def get_balances(self) -> dict[str, int]:
        return {k.as_hex: int(v) for k, v in self.balances.items()}

    @gl.public.view
    def get_balance_of(self, address: str) -> int:
        return int(self.balances.get(Address(address), u256(0)))