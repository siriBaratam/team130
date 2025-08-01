import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  Calendar, 
  Mail,
  Plus,
  Trash2,
  Send,
  Loader2,
  CheckCircle,
  Zap,
  Heart,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateStudyTip } from '@/utils/huggingface';
import { useUser } from '@/contexts/UserContext';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const StudyTip: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const { toast } = useToast();
  const { settings } = useUser();

  const motivationStyles = [
    {
      id: 'intense' as const,
      name: 'Intense',
      description: 'High-energy, motivational approach',
      icon: Zap,
      color: 'hsl(var(--warning))',
    },
    {
      id: 'gentle' as const,
      name: 'Gentle',
      description: 'Calm, supportive guidance',
      icon: Heart,
      color: 'hsl(var(--tip-primary))',
    },
    {
      id: 'balanced' as const,
      name: 'Balanced',
      description: 'Structured, steady progress',
      icon: Scale,
      color: 'hsl(var(--primary))',
    },
  ];

  const handleGenerateTip = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a study topic or subject.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const generatedTip = await generateStudyTip(topic, settings.motivationLevel);
      setTip(generatedTip);
      
      toast({
        title: "Study tip generated!",
        description: "Your personalized study guidance is ready.",
      });
    } catch (error) {
      console.error('Error generating tip:', error);
      toast({
        title: "Generation failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    };
    
    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const sendEmailReminder = async () => {
    if (!email.trim() || todos.length === 0) {
      toast({
        title: "Missing information",
        description: "Please enter an email and add some todo items.",
        variant: "destructive",
      });
      return;
    }

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEmailSent(true);
    toast({
      title: "Reminder sent!",
      description: `Study reminders sent to ${email}`,
    });
    
    setTimeout(() => setEmailSent(false), 3000);
  };

  const currentMotivationStyle = motivationStyles.find(style => style.id === settings.motivationLevel);

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
            <span className="bg-gradient-to-r from-tip to-accent bg-clip-text text-transparent">
              Study Tips & Motivation
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized study strategies, motivation, and organize your learning goals
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tip Generation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="h-6 w-6 text-tip" />
                <h2 className="text-xl font-semibold">Get Study Guidance</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    What would you like help with?
                  </label>
                  <Input
                    placeholder="e.g., Calculus exam preparation, time management, motivation..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateTip()}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Motivation Style:</span>
                  <div className="flex items-center space-x-2">
                    {currentMotivationStyle && (
                      <>
                        <currentMotivationStyle.icon 
                          className="h-4 w-4" 
                          style={{ color: currentMotivationStyle.color }} 
                        />
                        <span>{currentMotivationStyle.name}</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateTip}
                  disabled={isLoading}
                  className="w-full study-button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Generate Study Tip
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Generated Tip */}
            <AnimatePresence>
              {tip && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 border-tip/20 bg-gradient-to-br from-tip/5 to-accent/5">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                        {tip}
                      </pre>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Todo List & Email Reminders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Todo List */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Study Goals</h2>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a study goal..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    className="flex-1"
                  />
                  <Button onClick={addTodo} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {todos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg border
                                 ${todo.completed ? 'bg-success/10 border-success/20' : 'bg-card border-border'}`}
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                   transition-colors ${
                          todo.completed 
                            ? 'bg-success border-success text-success-foreground' 
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {todo.completed && <CheckCircle className="h-3 w-3" />}
                      </button>
                      <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {todo.text}
                      </span>
                      <Button
                        onClick={() => removeTodo(todo.id)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {todos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No study goals yet. Add some to get started!</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Email Reminders */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-semibold">Email Reminders</h2>
              </div>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">We'll send reminders for your study goals based on your frequency preference:</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="capitalize">{settings.notificationFrequency} reminders</span>
                  </div>
                </div>

                <Button
                  onClick={sendEmailReminder}
                  disabled={emailSent}
                  className="w-full"
                  variant={emailSent ? "outline" : "default"}
                >
                  {emailSent ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-success" />
                      Sent Successfully
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reminders
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudyTip;