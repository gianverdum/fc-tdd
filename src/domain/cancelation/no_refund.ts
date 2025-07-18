import { RefundRule } from "./refund_rule.interface";

export class NoRefund implements RefundRule {
    claculateRefund(totalPrice: number): number {
        return totalPrice;
    }
}