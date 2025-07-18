import { PartialRefund } from "./partial_refund";
import { RefundRule } from "./refund_rule.interface";

describe("PartialRefund", () => {
  it("should return 50% of the total price", () => {
    const rule: RefundRule = new PartialRefund();
    expect(rule.claculateRefund(1000)).toBe(500);
    expect(rule.claculateRefund(200)).toBe(100);
    expect(rule.claculateRefund(0)).toBe(0);
  });
});
