export interface Quote {
  text: string;
  code: { keyword: string; variable: string; value: string };
}

export const QUOTES: Quote[] = [
  {
    text: `"You're the semicolon to my statements."`,
    code: { keyword: "const", variable: "love", value: "true" },
  },
  {
    text: `"You had me at 'Hello, World!'"`,
    code: { keyword: "let", variable: "heart", value: '"yours"' },
  },
  {
    text: `"I'd never mass-assign you — you're one of a kind."`,
    code: { keyword: "const", variable: "soulmate", value: "await find(you)" },
  },
  {
    text: `"Are you a compiler? Because every time I see you, my heart races."`,
    code: { keyword: "while", variable: "(true)", value: "love++" },
  },
  {
    text: `"You must be CSS — you make everything beautiful."`,
    code: { keyword: "return", variable: "smile", value: "<Heart />" },
  },
];
