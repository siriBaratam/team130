import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Brain, 
  Target, 
  BookOpen, 
  MessageSquare,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { generateContent, processFile } from '@/utils/huggingface';
import { useUser } from '@/contexts/UserContext';

type AnalysisType = 'quiz' | 'summary' | 'flashcards' | 'qa';

const EduExtract: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<AnalysisType>('quiz');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  
  const { toast } = useToast();
  const { settings, updateStats } = useUser();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setInputMode('file');
      toast({
        title: "File uploaded successfully",
        description: `${acceptedFiles[0].name} is ready for analysis.`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalyze = async () => {
    let content = '';
    
    try {
      setIsLoading(true);
      
      if (inputMode === 'text' && inputText.trim()) {
        content = inputText.trim();
      } else if (inputMode === 'file' && uploadedFile) {
        content = await processFile(uploadedFile);
      } else {
        toast({
          title: "No content provided",
          description: "Please enter text or upload a file to analyze.",
          variant: "destructive",
        });
        return;
      }

      const analysisResult = await generateContent(content, selectedType, {
        difficulty: settings.quizDifficulty,
        temperature: settings.aiTemperature,
        responseLength: settings.responseLength,
        thinkingStyle: settings.thinkingStyle,
      });

      setResult(analysisResult);
      
      // Update user stats
      const statUpdate: any = {};
      switch (selectedType) {
        case 'quiz':
          statUpdate.quizzesTaken = settings.quizDifficulty === 'beginner' ? 1 : 
                                   settings.quizDifficulty === 'intermediate' ? 2 : 3;
          break;
        case 'summary':
          statUpdate.summariesGenerated = 1;
          break;
        case 'flashcards':
          statUpdate.flashcardsCreated = Array.isArray(analysisResult) ? analysisResult.length : 3;
          break;
        case 'qa':
          statUpdate.questionsAnswered = Array.isArray(analysisResult) ? analysisResult.length : 3;
          break;
      }
      updateStats(statUpdate);

      toast({
        title: "Analysis complete!",
        description: `Your ${selectedType} has been generated successfully.`,
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analysisOptions = [
    {
      id: 'quiz' as AnalysisType,
      title: 'Quiz',
      description: 'Generate interactive questions',
      icon: Target,
      color: 'hsl(var(--quiz-primary))',
    },
    {
      id: 'summary' as AnalysisType,
      title: 'Summary',
      description: 'Extract key insights',
      icon: BookOpen,
      color: 'hsl(var(--summary-primary))',
    },
    {
      id: 'flashcards' as AnalysisType,
      title: 'Flashcards',
      description: 'Create study cards',
      icon: Brain,
      color: 'hsl(var(--flashcard-primary))',
    },
    {
      id: 'qa' as AnalysisType,
      title: 'Q&A',
      description: 'Question and answer pairs',
      icon: MessageSquare,
      color: 'hsl(var(--tip-primary))',
    },
  ];

  const renderResult = () => {
    if (!result) return null;

    switch (selectedType) {
      case 'quiz':
      case 'summary':
        return (
          <Card className="p-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                {result}
              </pre>
            </div>
          </Card>
        );
      
      case 'flashcards':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {result.map((card: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group perspective-1000"
              >
                <Card className="h-32 p-4 cursor-pointer transition-transform duration-300 
                               hover:scale-105 relative preserve-3d group-hover:rotate-y-180">
                  <div className="absolute inset-0 p-4 backface-hidden">
                    <div className="text-sm text-muted-foreground mb-2">Front</div>
                    <div className="text-foreground font-medium">{card.front}</div>
                  </div>
                  <div className="absolute inset-0 p-4 backface-hidden rotate-y-180 bg-primary/5">
                    <div className="text-sm text-muted-foreground mb-2">Back</div>
                    <div className="text-foreground">{card.back}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        );
      
      case 'qa':
        return (
          <div className="space-y-4">
            {result.map((qa: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Q: {qa.question}</h4>
                      </div>
                    </div>
                    <div className="ml-9 text-muted-foreground">
                      <strong>A:</strong> {qa.answer}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Edu Extract
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform any content into personalized study materials powered by AI
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="p-6">
              <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as 'text' | 'file')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Text Input</span>
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>File Upload</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-6">
                  <Textarea
                    placeholder="Paste your study content here... (notes, articles, textbook excerpts, etc.)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </TabsContent>
                
                <TabsContent value="file" className="mt-6">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                               ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-primary">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">{uploadedFile.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          File ready for analysis
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-foreground font-medium">
                          {isDragActive ? 'Drop your file here' : 'Drag & drop a file here'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports .txt and .md files up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Analysis Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Choose Analysis Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analysisOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(option.id)}
                  className={`feature-card group cursor-pointer p-4 text-center transition-all duration-300
                             ${selectedType === option.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                >
                  <div 
                    className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    <option.icon className="h-6 w-6" style={{ color: option.color }} />
                  </div>
                  <h4 className="font-medium mb-1">{option.title}</h4>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={isLoading || (!inputText.trim() && !uploadedFile)}
              className="study-button px-8 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Analyze Content
                </>
              )}
            </Button>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold">
                  Your {analysisOptions.find(opt => opt.id === selectedType)?.title} Results
                </h3>
                {renderResult()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EduExtract;