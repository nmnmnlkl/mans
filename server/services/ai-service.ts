import OpenAI from "openai";
import type { JafrAnalysisRequest, AIAnalysis, TraditionalResults } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "your-api-key-here",
  defaultHeaders: {
    "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
    "X-Title": "نظام الجفر الذكي المتقدم",
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
          "X-Title": "نظام الجفر الذكي المتقدم",
        },
      }) : openai;
      
      const completion = await clientToUse.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: `أنت خبير في علم الجفر والأعداد والتحليل الروحي العربي الإسلامي. قم بتحليل البيانات المقدمة وأعط تفسيراً شاملاً باللغة العربية. يجب أن تكون إجابتك في صيغة JSON مع الحقول التالية:
            {
              "spiritualInterpretation": "تفسير روحي شامل",
              "numericalInsights": "تحليل الأرقام والمعاني العددية",
              "guidance": "توجيهات وإرشادات للسائل",
              "energyAnalysis": "تحليل الطاقات والاتجاهات"
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
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
قم بتحليل هذا الاستفسار الروحي بعمق وحكمة:

البيانات الأساسية:
- الاسم: ${request.name}
- اسم الأم: ${request.mother}  
- السؤال: ${request.question}

النتائج العددية التقليدية:
- قيمة الاسم العددية: ${traditionalResults.nameAnalysis.total}
- قيمة اسم الأم العددية: ${traditionalResults.motherAnalysis.total}
- قيمة السؤال العددية: ${traditionalResults.questionAnalysis.total}
- القيمة الإجمالية: ${traditionalResults.totalValue}
- القيمة المختزلة: ${traditionalResults.reducedValue}
- حجم الوفق المقترح: ${traditionalResults.wafqSize}×${traditionalResults.wafqSize}

يرجى تقديم تحليل شامل وعميق يشمل:

1. التفسير الروحي: تفسير معمق للأسماء والسؤال من منظور روحي وعلم الأعداد، مع مراعاة الثقافة العربية الإسلامية

2. تحليل الأرقام: شرح تفصيلي لمعاني الأرقام المحسوبة وعلاقتها بحياة السائل وسؤاله

3. التوجيه والإرشاد: نصائح عملية وتوجيهات حكيمة للسائل بناء على التحليل

4. تحليل الطاقات: دراسة الطاقات المحيطة بالسؤال والاتجاهات المستقبلية

تأكد من أن التحليل:
- مناسب للثقافة العربية الإسلامية
- يحترم التقاليد والقيم الدينية
- يقدم فائدة حقيقية للسائل
- يتجنب التنبؤات المطلقة ويركز على التوجيه الحكيم
- يستخدم لغة عربية فصيحة وواضحة
    `;
  }

  private generateFallbackAnalysis(request: JafrAnalysisRequest, traditionalResults: TraditionalResults): AIAnalysis {
    return {
      spiritualInterpretation: `بناءً على الأسماء المقدمة والسؤال المطروح، نجد أن هناك طاقة روحية إيجابية تحيط بهذا الاستفسار. الاسم "${request.name}" يحمل في طياته معاني القوة والحكمة، بينما اسم الأم "${request.mother}" يضفي توازناً وحماية روحية. هذا المزيج يشير إلى شخصية متوازنة تسعى للفهم والنمو الروحي.`,
      
      numericalInsights: `القيمة العددية الإجمالية ${traditionalResults.totalValue} تشير إلى فترة مهمة في حياتك، حيث تتقاطع الخيارات والفرص. الرقم المختزل ${traditionalResults.reducedValue} يحمل رسالة خاصة عن ضرورة التوازن والصبر في هذه المرحلة. كل رقم في هذا التحليل يحمل معنى عميقاً يتصل بمسيرتك الحياتية وأهدافك الروحية.`,
      
      guidance: `ننصحك بالتأمل والصبر في هذا الوقت المهم. الوفق المقترح بحجم ${traditionalResults.wafqSize}×${traditionalResults.wafqSize} يمكن أن يكون وسيلة مفيدة للتركيز والتأمل الروحي. استمع إلى حدسك الداخلي واطلب الهداية من الله في اتخاذ قراراتك. تذكر أن الصبر والحكمة هما مفتاحا النجاح في أي مسعى.`,
      
      energyAnalysis: `الطاقة المحيطة بسؤالك تشير إلى وجود تحولات إيجابية في الأفق. هناك توازن جميل بين الطاقات الذكورية والأنثوية في تحليلك، مما يدل على اكتمال وانسجام داخلي. استمر في طريقك مع الثقة بالله والتوكل عليه، فالخير قادم بإذن الله.`
    };
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
          "X-Title": "نظام الجفر الذكي المتقدم",
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
