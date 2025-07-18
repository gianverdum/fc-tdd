import { RefundRule } from "./refund_rule.interface";

export class FullRefund implements RefundRule {
    claculateRefund(totalPrice: number): number {
        return 0;
    }
}