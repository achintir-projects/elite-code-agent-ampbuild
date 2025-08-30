module uart #(parameter CLK_HZ=50000000, parameter BAUD=115200) (
    input  logic clk,
    input  logic rst,
    input  logic rx,
    output logic tx
);
    // Minimal stub: loopback
    assign tx = rx;
endmodule
