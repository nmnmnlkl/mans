import OpenAI from "openai";
import type { JafrAnalysisRequest, AIAnalysis, TraditionalResults } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "your-api-key-here",
  defaultHeaders: {
    "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
    "X-Title": "Advanced Jafr Analysis System",
  },
});

export class AIService {
  async analyzeJafrContext(
    request: JafrAnalysisRequest,
    traditionalResults: TraditionalResults,
    apiKey?: string
  ): Promise<AIAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(request, traditionalResults);
      
      // Create OpenAI client with provided API key if available
      const clientToUse = apiKey ? new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        defaultHeaders: {
          "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
          "X-Title": "Advanced Jafr Analysis System",
        },
      }) : openai;
      
      const completion = await clientToUse.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: `أنت خبير متخصص في علم الجفر والأعداد والتحليل الروحي الإسلامي. مهمتك تقديم إجابات واضحة ومباشرة وصريحة للسائل بناءً على حساباته العددية وسؤاله المحدد.

المطلوب منك:
1. فهم السؤال المطروح بدقة والإجابة عليه مباشرة
2. ربط الحسابات العددية بالسؤال المحدد
3. تقديم إجابة صريحة ومفيدة عملياً
4. تجنب العموميات والكلام المبهم
5. التركيز على الجواب العملي للسؤال

يجب أن تكون إجابتك في صيغة JSON مع الحقول التالية:
{
  "spiritualInterpretation": "إجابة مباشرة وصريحة على السؤال المطروح مع التفسير الروحي",
  "numericalInsights": "كيف تدعم الأرقام المحسوبة الإجابة على السؤال",
  "guidance": "توجيه عملي محدد للسائل حول سؤاله",
  "energyAnalysis": "تحليل الطاقات المرتبطة بالسؤال والوضع الحالي"
}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 3000,
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error("لم يتم الحصول على رد من نموذج الذكاء الاصطناعي");
      }

      const parsed = JSON.parse(response);
      
      // Validate the response structure
      const requiredFields = ['spiritualInterpretation', 'numericalInsights', 'guidance', 'energyAnalysis'];
      for (const field of requiredFields) {
        if (!parsed[field]) {
          parsed[field] = `تعذر الحصول على تحليل ${field}. يرجى المحاولة مرة أخرى.`;
        }
      }

      return parsed as AIAnalysis;
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      
      // Fallback analysis if AI fails
      return this.generateFallbackAnalysis(request, traditionalResults);
    }
  }

  private buildAnalysisPrompt(request: JafrAnalysisRequest, traditionalResults: TraditionalResults): string {
    return `
السؤال المطروح: "${request.question}"

بيانات السائل:
- الاسم: ${request.name} (قيمة عددية: ${traditionalResults.nameAnalysis.total})
- اسم الأم: ${request.mother} (قيمة عددية: ${traditionalResults.motherAnalysis.total})
- قيمة السؤال العددية: ${traditionalResults.questionAnalysis.total}
- المجموع الكلي: ${traditionalResults.totalValue}
- الرقم المختزل: ${traditionalResults.reducedValue}

مطلوب منك:
1. فهم السؤال المطروح والإجابة عليه بوضوح وصراحة
2. ربط الأرقام المحسوبة بالإجابة على السؤال المحدد
3. تقديم توجيه عملي ومفيد للسائل
4. تجنب الكلام العام وركز على السؤال المطروح

أجب على السؤال مباشرة باستخدام علم الجفر والأرقام، واجعل إجابتك:
- صريحة ومباشرة
- مرتبطة بالسؤال المطروح
- مبنية على الحسابات العددية
- عملية ومفيدة للسائل
- متوافقة مع القيم الإسلامية

لا تعط إجابات عامة، بل أجب على السؤال المحدد الذي طرحه السائل.
    `;
  }

  private generateFallbackAnalysis(request: JafrAnalysisRequest, traditionalResults: TraditionalResults): AIAnalysis {
    // Generate more specific fallback based on the question and numbers
    const questionType = this.analyzeQuestionType(request.question);
    const numericalGuidance = this.getNumericalGuidance(traditionalResults.reducedValue);
    
    return {
      spiritualInterpretation: `بخصوص سؤالك: "${request.question}" - الحسابات العددية تُظهر أن اسمك "${request.name}" بقيمة ${traditionalResults.nameAnalysis.total} واسم أمك "${request.mother}" بقيمة ${traditionalResults.motherAnalysis.total} يشكلان توليفة عددية تدعم ${questionType.interpretation}. الرقم المختزل ${traditionalResults.reducedValue} يشير إلى ${numericalGuidance.meaning}.`,
      
      numericalInsights: `المجموع الكلي ${traditionalResults.totalValue} والرقم المختزل ${traditionalResults.reducedValue} يدلان على ${numericalGuidance.insight}. هذا الرقم في سياق سؤالك يعني ${questionType.numericalAdvice}.`,
      
      guidance: `الإجابة على سؤالك تكمن في ${questionType.directAnswer}. الأرقام تنصحك بـ${numericalGuidance.action}. ${questionType.practicalAdvice}`,
      
      energyAnalysis: `الطاقة المحيطة بـ${questionType.subject} ${questionType.energyReading}. الوقت الحالي ${numericalGuidance.timing} لاتخاذ خطوات في هذا الاتجاه.`
    };
  }

  private analyzeQuestionType(question: string): any {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('زواج') || lowerQuestion.includes('زوج') || lowerQuestion.includes('عريس')) {
      return {
        interpretation: 'الارتباط والزواج',
        numericalAdvice: 'التوقيت المناسب للخطوات الجادة في العلاقات',
        directAnswer: 'الصبر والدعاء مع اتخاذ الأسباب المناسبة',
        practicalAdvice: 'ابحث عن الشخص المناسب واستشر أهل الخبرة.',
        subject: 'الزواج',
        energyReading: 'تشير إلى فرص إيجابية في المستقبل القريب'
      };
    } else if (lowerQuestion.includes('عمل') || lowerQuestion.includes('وظيف') || lowerQuestion.includes('مهن')) {
      return {
        interpretation: 'المسار المهني والعمل',
        numericalAdvice: 'الوقت المناسب للتطوير المهني',
        directAnswer: 'التركيز على تطوير المهارات والسعي للفرص',
        practicalAdvice: 'استثمر في تعلم مهارات جديدة وتوسيع شبكة علاقاتك المهنية.',
        subject: 'العمل',
        energyReading: 'تدعم النمو والتقدم المهني'
      };
    } else if (lowerQuestion.includes('مال') || lowerQuestion.includes('رزق') || lowerQuestion.includes('ثرو')) {
      return {
        interpretation: 'الرزق والحالة المالية',
        numericalAdvice: 'إمكانية تحسن الوضع المالي',
        directAnswer: 'الاجتهاد في العمل مع التوكل على الله',
        practicalAdvice: 'وضع خطة مالية واضحة والادخار بانتظام.',
        subject: 'المال والرزق',
        energyReading: 'تشير إلى فرص للتحسن المالي'
      };
    } else if (lowerQuestion.includes('صح') || lowerQuestion.includes('مرض') || lowerQuestion.includes('علاج')) {
      return {
        interpretation: 'الصحة والعافية',
        numericalAdvice: 'الاهتمام بالصحة الجسدية والنفسية',
        directAnswer: 'الالتزام بنمط حياة صحي والمتابعة الطبية',
        practicalAdvice: 'اهتم بالتغذية السليمة والرياضة المنتظمة.',
        subject: 'الصحة',
        energyReading: 'تدعم التعافي والحفاظ على الصحة'
      };
    } else {
      return {
        interpretation: 'الموضوع المطروح',
        numericalAdvice: 'النظر بعين الحكمة والصبر',
        directAnswer: 'التأني والاستخارة قبل اتخاذ القرارات المهمة',
        practicalAdvice: 'استشر أهل الخبرة واطلب الهداية من الله.',
        subject: 'الأمر المسؤول عنه',
        energyReading: 'متوازنة وتدعو للتفكير العميق'
      };
    }
  }

  private getNumericalGuidance(reducedNumber: number): any {
    const guidance: Record<number, any> = {
      1: { 
        meaning: 'بداية جديدة وقيادة',
        insight: 'وقت للمبادرة والخطوات الجديدة',
        action: 'الثقة بالنفس واتخاذ زمام المبادرة',
        timing: 'مناسب'
      },
      2: { 
        meaning: 'التعاون والشراكة',
        insight: 'أهمية العمل مع الآخرين',
        action: 'البحث عن الشراكات والتعاون',
        timing: 'يتطلب صبراً'
      },
      3: { 
        meaning: 'الإبداع والتواصل',
        insight: 'فرص للتعبير والإبداع',
        action: 'استخدام المهارات الإبداعية',
        timing: 'مثمر للمشاريع الإبداعية'
      },
      4: { 
        meaning: 'النظام والاستقرار',
        insight: 'الحاجة للتنظيم والعمل المنهجي',
        action: 'وضع خطط واضحة والالتزام بها',
        timing: 'يتطلب صبراً ومثابرة'
      },
      5: { 
        meaning: 'التغيير والحرية',
        insight: 'وقت للتغييرات الإيجابية',
        action: 'الانفتاح على الفرص الجديدة',
        timing: 'مناسب للتغيير'
      },
      6: { 
        meaning: 'المسؤولية والانسجام',
        insight: 'أهمية العائلة والعلاقات',
        action: 'الاهتمام بالعلاقات الأسرية',
        timing: 'مناسب للقرارات العائلية'
      },
      7: { 
        meaning: 'الحكمة والروحانية',
        insight: 'وقت للتأمل والبحث عن المعنى',
        action: 'الاستعانة بالصلاة والتأمل',
        timing: 'يتطلب تفكيراً عميقاً'
      },
      8: { 
        meaning: 'القوة والإنجاز',
        insight: 'فرص للنجاح المادي',
        action: 'التركيز على الأهداف الكبيرة',
        timing: 'مناسب للمشاريع الطموحة'
      },
      9: { 
        meaning: 'الاكتمال والخدمة',
        insight: 'وقت لإنهاء المراحل وبداية جديدة',
        action: 'خدمة الآخرين والعطاء',
        timing: 'نهاية مرحلة وبداية أخرى'
      }
    };
    
    return guidance[reducedNumber] || guidance[1];
  }

  async generateCombinedInterpretation(
    traditionalResults: TraditionalResults,
    aiAnalysis: AIAnalysis,
    apiKey?: string
  ): Promise<string> {
    try {
      const prompt = `
بناء على النتائج التقليدية والتحليل الذكي التالي، قم بإنشاء تفسير متكامل بصيغة HTML:

النتائج التقليدية:
- القيمة الإجمالية: ${traditionalResults.totalValue}
- القيمة المختزلة: ${traditionalResults.reducedValue}
- حجم الوفق: ${traditionalResults.wafqSize}×${traditionalResults.wafqSize}

التحليل الذكي:
- التفسير الروحي: ${aiAnalysis.spiritualInterpretation}
- تحليل الأرقام: ${aiAnalysis.numericalInsights}
- التوجيه: ${aiAnalysis.guidance}
- تحليل الطاقات: ${aiAnalysis.energyAnalysis}

اكتب تفسيراً متكاملاً بصيغة HTML يدمج بين النتائج التقليدية والتحليل الذكي، مع التركيز على:
1. الخلاصة المتكاملة
2. التوصيات العملية
3. استخدام العناصر HTML المناسبة (div, h4, p, ul, li) مع الفئات المناسبة

يجب أن يكون التفسير باللغة العربية ومناسب للثقافة الإسلامية.
      `;

      // Create OpenAI client with provided API key if available
      const clientToUse = apiKey ? new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        defaultHeaders: {
          "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
          "X-Title": "Advanced Jafr Analysis System",
        },
      }) : openai;

      const completion = await clientToUse.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1500,
      });

      return completion.choices[0].message.content || this.generateFallbackCombinedInterpretation();
      
    } catch (error) {
      console.error('Combined Interpretation Error:', error);
      return this.generateFallbackCombinedInterpretation();
    }
  }

  private generateFallbackCombinedInterpretation(): string {
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-xl p-6 border border-purple-200">
          <h4 class="font-bold text-purple-800 mb-3 flex items-center">
            <i class="fas fa-infinity mr-2"></i>
            الخلاصة المتكاملة
          </h4>
          <p class="text-gray-700 leading-relaxed">
            من خلال دمج النتائج التقليدية مع التحليل الذكي، نجد أن الإجابة على سؤالك تكمن في التوازن بين الصبر والعمل. 
            القيم العددية تدعم هذا التوجه، والتحليل الذكي يؤكد على أهمية الوقت الحالي كفترة نمو وتطور روحي.
          </p>
        </div>
        
        <div class="bg-white rounded-xl p-6 border border-purple-200">
          <h4 class="font-bold text-purple-800 mb-3 flex items-center">
            <i class="fas fa-lightbulb mr-2"></i>
            التوصيات العملية
          </h4>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
              استخدم الوفق المحسوب للتأمل والتركيز الروحي يومياً
            </li>
            <li class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
              اعتمد على الصبر والحكمة في اتخاذ القرارات المهمة
            </li>
            <li class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
              ابحث عن التوازن بين الجوانب المادية والروحية في حياتك
            </li>
            <li class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
              استمر في الدعاء والتوكل على الله في جميع أمورك
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}

export const aiService = new AIService();
