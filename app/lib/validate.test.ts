
import { describe, expect, it } from "vitest";
import {
    isValidMessageLength,
    getRecentMessages,
} from "./validate";

describe("メッセージの文字数チェック", () => {
    it("999文字ならtrueを返す", () => {
        expect(isValidMessageLength("あ".repeat(999))).toBe(true);
    });

    it("1000文字ならtrueを返す", () => {
        expect(isValidMessageLength("あ".repeat(1000))).toBe(true);
    });

    it("1001文字ならfalseを返す", () => {
        expect(isValidMessageLength("あ".repeat(1001))).toBe(false);
    });
});


describe("会話履歴の10件制限", () => {
    it("5件ならすべて取得する", () => {
        const messages = ["A", "B", "C", "D", "E"];

        expect(getRecentMessages(messages)).toEqual(messages);
    });

    it("10件ならすべて取得する", () => {
        const messages = Array.from({ length: 10 }, (_, i) => i + 1);

        expect(getRecentMessages(messages)).toEqual(messages);
    });

    it("15件なら最新10件だけ取得する", () => {
        const messages = Array.from({ length: 15 }, (_, i) => i + 1);

        expect(getRecentMessages(messages)).toEqual([
            6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        ]);
    });
});
