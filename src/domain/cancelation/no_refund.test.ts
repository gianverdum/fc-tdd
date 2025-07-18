import { NoRefund } from "./no_refund";
import { RefundRule } from "./refund_rule.interface";

describe("NoRefund", () => {
  it("should always maintain the total price for any cancellation", () => {
    const rule: RefundRule = new NoRefund();
    expect(rule.claculateRefund(1000)).toBe(1000);
    expect(rule.claculateRefund(0)).toBe(0);
    expect(rule.claculateRefund(99999)).toBe(99999);
  });
});
