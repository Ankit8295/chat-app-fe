"use client";
import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import CustomInput from "./input";
import Typography from "../typography/typography";
import { useTranslations } from "next-intl";

interface WordInputProps {
  maxSlots?: number;
  onChange?: (words: string[]) => void;
  className?: string;
  columns?: number;
}

export default function WordInput({
  maxSlots = 6,
  onChange,
  columns = 4,
}: WordInputProps) {
  const t = useTranslations();
  const [words, setWords] = useState<string[]>(Array(maxSlots).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
    onChange?.(newWords);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !words[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const pastedWords = pastedText
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const newWords = [...words];
    pastedWords.forEach((word, i) => {
      if (i < maxSlots) {
        newWords[i] = word;
      }
    });

    setWords(newWords);
    onChange?.(newWords);
  };

  return (
    <div
      className={"grid gap-2"}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {words.map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[max-content_1fr] items-center gap-1"
        >
          <Typography className="w-[2ch] text-end opacity-60" variant="span">
            {index + 1}.
          </Typography>
          <CustomInput
            id={"" + index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            placeholder={t("label-word-placeholder")}
            type="text"
            value={words[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            variant="bordered"
            fullWidth
            classNames={{
              input: "text-center px-1 py-2",
            }}
          />
        </div>
      ))}
    </div>
  );
}
