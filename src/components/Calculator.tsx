import { useState } from "react";

type CalcButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "number" | "op" | "fn";
  wide?: boolean;
};

const CalcButton = ({ label, onClick, variant = "number", wide = false }: CalcButtonProps) => {
  const base = "flex items-center justify-center rounded-full text-calc-text text-xl font-medium transition-colors active:animate-btn-press select-none h-16";
  const variants = {
    number: "bg-calc-number hover:bg-calc-number-hover",
    op: "bg-calc-op hover:bg-calc-op-hover text-2xl font-semibold",
    fn: "bg-calc-fn hover:bg-calc-fn-hover",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${wide ? "col-span-2 px-6 justify-start" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const inputDigit = (d: string) => {
    if (resetNext) {
      setDisplay(d);
      setResetNext(false);
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  };

  const inputDot = () => {
    if (resetNext) { setDisplay("0."); setResetNext(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setResetNext(false); };

  const toggleSign = () => setDisplay(String(-parseFloat(display)));

  const percent = () => setDisplay(String(parseFloat(display) / 100));

  const calculate = (a: number, b: number, operator: string) => {
    switch (operator) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleOp = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !resetNext) {
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setResetNext(true);
  };

  const handleEquals = () => {
    if (prev === null || !op) return;
    const result = calculate(prev, parseFloat(display), op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setResetNext(true);
  };

  const formatDisplay = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0";
    if (val.endsWith(".") || val.endsWith(".0")) return val;
    if (val.includes(".") && val.endsWith("0")) return val;
    if (Math.abs(num) >= 1e12) return num.toExponential(4);
    return num.toLocaleString("en-US", { maximumFractionDigits: 10 });
  };

  const displaySize = display.length > 10 ? "text-3xl" : display.length > 7 ? "text-4xl" : "text-5xl";

  return (
    <div className="w-full max-w-xs mx-auto bg-calc-bg rounded-3xl p-5 shadow-2xl">
      <div className="bg-calc-display rounded-2xl px-5 py-6 mb-4 flex items-end justify-end min-h-[90px]">
        <span className={`${displaySize} font-light text-calc-text tracking-tight transition-all`}>
          {formatDisplay(display)}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <CalcButton label="AC" onClick={clear} variant="fn" />
        <CalcButton label="+/−" onClick={toggleSign} variant="fn" />
        <CalcButton label="%" onClick={percent} variant="fn" />
        <CalcButton label="÷" onClick={() => handleOp("÷")} variant="op" />

        <CalcButton label="7" onClick={() => inputDigit("7")} />
        <CalcButton label="8" onClick={() => inputDigit("8")} />
        <CalcButton label="9" onClick={() => inputDigit("9")} />
        <CalcButton label="×" onClick={() => handleOp("×")} variant="op" />

        <CalcButton label="4" onClick={() => inputDigit("4")} />
        <CalcButton label="5" onClick={() => inputDigit("5")} />
        <CalcButton label="6" onClick={() => inputDigit("6")} />
        <CalcButton label="−" onClick={() => handleOp("−")} variant="op" />

        <CalcButton label="1" onClick={() => inputDigit("1")} />
        <CalcButton label="2" onClick={() => inputDigit("2")} />
        <CalcButton label="3" onClick={() => inputDigit("3")} />
        <CalcButton label="+" onClick={() => handleOp("+")} variant="op" />

        <CalcButton label="0" onClick={() => inputDigit("0")} wide />
        <CalcButton label="." onClick={inputDot} />
        <CalcButton label="=" onClick={handleEquals} variant="op" />
      </div>
    </div>
  );
};

export default Calculator;
