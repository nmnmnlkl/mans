// القيم العددية المتقدمة لحساب الجمل (الكبير والصغير)
export const abjad = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000, ' ': 0
} as const;

// القيم الصغيرة (حساب أبجد هوز)
export const smallAbjad = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 11, 'ل': 12,
  'م': 13, 'ن': 14, 'س': 15, 'ع': 16, 'ف': 17,
  'ص': 18, 'ق': 19, 'ر': 20, 'ش': 21, 'ت': 22,
  'ث': 23, 'خ': 24, 'ذ': 25, 'ض': 26, 'ظ': 27,
  'غ': 28, ' ': 0
} as const;

export interface NumerologyAnalysis {
  total: number;
  details: Array<{ char: string; value: number }>;
}

export function calculateBasicNumerology(text: string): NumerologyAnalysis {
  let total = 0;
  const details: Array<{ char: string; value: number }> = [];
  
  for (const char of text) {
    if (abjad[char as keyof typeof abjad]) {
      const value = abjad[char as keyof typeof abjad];
      total += value;
      details.push({ char, value });
    }
  }
  
  return { total, details };
}

export function calculateSmallNumerology(text: string): NumerologyAnalysis {
  let total = 0;
  const details: Array<{ char: string; value: number }> = [];
  
  for (const char of text) {
    if (smallAbjad[char as keyof typeof smallAbjad]) {
      const value = smallAbjad[char as keyof typeof smallAbjad];
      total += value;
      details.push({ char, value });
    }
  }
  
  return { total, details };
}

export function reduceToSingleDigit(number: number): number {
  while (number > 9) {
    number = number.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return number;
}

export function getBasicMeaning(number: number): string {
  const meanings: Record<number, string> = {
    1: "قيادة وبداية",
    2: "توازن وشراكة", 
    3: "إبداع وتعبير",
    4: "استقرار وتنظيم",
    5: "حرية وتغيير",
    6: "مسؤولية وانسجام",
    7: "حكمة وروحانية",
    8: "قوة وإنجاز",
    9: "اكتمال وحكمة"
  };
  
  const reduced = reduceToSingleDigit(number);
  return meanings[reduced] || "طاقة خاصة";
}

export function calculateWafqSize(totalValue: number): number {
  return Math.max(3, Math.min(9, Math.floor(Math.sqrt(totalValue / 10)) + 3));
}

// تحليل الحروف المفصل
export const letterAnalysis: Record<number, string> = {
  1: "قوة، بداية، قيادة",
  2: "توازن، شراكة، حساسية",
  3: "إبداع، تواصل، تعبير",
  4: "استقرار، تنظيم، عملية",
  5: "حرية، تغيير، مغامرة",
  6: "مسؤولية، انسجام، منزل",
  7: "حكمة، تحليل، روحانية",
  8: "قوة، إنجاز، وفرة",
  9: "اكتمال، إنسانية، حكمة",
  10: "قيادة، ابتكار، طموح",
  20: "حدس، تعاون، حساسية",
  30: "تعبير، إبداع، اجتماعية",
  40: "تنظيم، عملية، بناء",
  50: "تغيير، حرية، تنوع",
  60: "مسؤولية، عائلة، انسجام",
  70: "روحانية، حكمة، تحليل",
  80: "قوة مادية، إنجاز، طموح",
  90: "إنسانية، حكمة، خير عام",
  100: "قيادة، ابتكار، طموح كبير",
  200: "حدس قوي، تعاون، حساسية",
  300: "تعبير فني، إبداع، جمال",
  400: "تنظيم متقدم، استقرار، بناء",
  500: "تغيير جذري، ثورة، تطوير",
  600: "مسؤولية كبيرة، قيادة عائلية",
  700: "حكمة عميقة، معرفة روحية",
  800: "قوة عظيمة، تحكم، سيطرة",
  900: "اكتمال روحي، خدمة الإنسانية",
  1000: "قوة إلهية، تحول كامل"
};
