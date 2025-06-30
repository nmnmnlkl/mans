import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface JafrAnalysisRecord {
  id: number;
  name: string;
  mother: string;
  question: string;
  totalValue: number;
  reducedValue: number;
  wafqSize: number;
  aiEnabled: boolean;
  createdAt: string;
}

export default function History() {
  const { data: analyses, isLoading, error } = useQuery<JafrAnalysisRecord[]>({
    queryKey: ['/api/jafr/history'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">جاري تحميل السجل...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-lg text-red-600 dark:text-red-400">حدث خطأ في تحميل السجل</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            سجل التحليلات
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            جميع تحليلات الجفر السابقة
          </p>
        </div>

        {!analyses || analyses.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">لا توجد تحليلات محفوظة بعد</p>
            <Button 
              onClick={() => window.location.href = '/jafr-calculator'}
              className="mt-4"
            >
              إجراء تحليل جديد
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span>{analysis.name}</span>
                          <User className="h-5 w-5" />
                        </div>
                      </CardTitle>
                      <CardDescription className="text-right mt-2">
                        أم: {analysis.mother}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant={analysis.aiEnabled ? "default" : "secondary"}>
                        {analysis.aiEnabled ? "تحليل ذكي" : "تحليل أساسي"}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>
                          {format(new Date(analysis.createdAt), "PPp", { locale: ar })}
                        </span>
                        <Clock className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-right mb-2">السؤال:</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-right leading-relaxed">
                        {analysis.question}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {analysis.totalValue}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          القيمة الإجمالية
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {analysis.reducedValue}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          الرقم المختزل
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {analysis.wafqSize}×{analysis.wafqSize}
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">
                          حجم الوفق
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(`/api/jafr/analysis/${analysis.id}`, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <span>عرض التفاصيل</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}