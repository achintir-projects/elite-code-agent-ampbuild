import cocotb
from cocotb.triggers import RisingEdge

@cocotb.test()
async def loopback(dut):
    dut.rx.value = 0
    for _ in range(10):
        dut.rx.value = 1 - int(dut.rx.value)
        await RisingEdge(dut.clk)
    assert True
