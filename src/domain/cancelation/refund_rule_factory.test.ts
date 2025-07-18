import { RefundRuleFactory } from "./refund_rule_factory";
import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { PartialRefund } from "./partial_refund";

describe("RefundRuleFactory", () => {
  it("should return FullRefund when daysUntilCheckIn > 7", () => {
    const rule = RefundRuleFactory.getRefundRule(8);
    expect(rule).toBeInstanceOf(FullRefund);
  });

  it("should return PartialRefund when daysUntilCheckIn between 1 and 7", () => {
    for (let days = 1; days <= 7; days++) {
      const rule = RefundRuleFactory.getRefundRule(days);
      expect(rule).toBeInstanceOf(PartialRefund);
    }
  });

  it("should return NoRefund when daysUntilCheckIn < 1", () => {
    const rule = RefundRuleFactory.getRefundRule(0);
    expect(rule).toBeInstanceOf(NoRefund);
    const ruleNegative = RefundRuleFactory.getRefundRule(-5);
    expect(ruleNegative).toBeInstanceOf(NoRefund);
  });
});
