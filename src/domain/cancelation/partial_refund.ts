import { RefundRule } from "./refund_rule.interface";

export class PartialRefund implements RefundRule {
    claculateRefund(totalPrice: number): number {
        return totalPrice * 0.5;
    }
}