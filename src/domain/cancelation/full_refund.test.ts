import { FullRefund } from "./full_refund";
import { RefundRule } from "./refund_rule.interface";

describe("FullRefund", () => {
  it("should always return 0 for any totalPrice", () => {
    const rule: RefundRule = new FullRefund();
    expect(rule.claculateRefund(1000)).toBe(0);
    expect(rule.claculateRefund(0)).toBe(0);
    expect(rule.claculateRefund(99999)).toBe(0);
  });
});
