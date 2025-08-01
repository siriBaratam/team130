import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Brain, 
  Palette, 
  Bell, 
  Shield,
  Download,
  Trash2,
  Eye,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

const Settings: React.FC = () => {
  const { settings, updateSettings, clearData } = useUser();
  const { toast } = useToast();

  const handleClearData = () => {
    clearData();
    toast({
      title: "Data cleared",
      description: "All your data has been reset to defaults.",
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-kit-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your study data has been downloaded.",
    });
  };

  const settingSections = [
    {
      title: 'Profile',
      icon: User,
      color: 'hsl(var(--primary))',
      items: [
        {
          label: 'Username',
          description: 'How you\'d like to be addressed',
          type: 'input' as const,
          value: settings.username,
          onChange: (value: string) => updateSettings({ username: value }),
        },
        {
          label: 'Language Preference',
          description: 'Choose your preferred language',
          type: 'select' as const,
          value: settings.language,
          options: ['English', 'Spanish', 'French', 'German', 'Chinese'],
          onChange: (value: string) => updateSettings({ language: value }),
        },
      ],
    },
    {
      title: 'AI & Learning',
      icon: Brain,
      color: 'hsl(var(--quiz-primary))',
      items: [
        {
          label: 'Quiz Difficulty',
          description: 'Default difficulty level for generated quizzes',
          type: 'select' as const,
          value: settings.quizDifficulty,
          options: ['beginner', 'intermediate', 'advanced'],
          onChange: (value: string) => updateSettings({ quizDifficulty: value as any }),
        },
        {
          label: 'AI Creativity',
          description: 'How creative should AI responses be (0 = Conservative, 1 = Very Creative)',
          type: 'slider' as const,
          value: settings.aiTemperature,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (value: number) => updateSettings({ aiTemperature: value }),
        },
        {
          label: 'Response Length',
          description: 'Preferred length for AI-generated content',
          type: 'select' as const,
          value: settings.responseLength,
          options: ['small', 'medium', 'large'],
          onChange: (value: string) => updateSettings({ responseLength: value as any }),
        },
        {
          label: 'Thinking Style',
          description: 'How should AI approach problems',
          type: 'select' as const,
          value: settings.thinkingStyle,
          options: ['analytical', 'creative', 'balanced'],
          onChange: (value: string) => updateSettings({ thinkingStyle: value as any }),
        },
        {
          label: 'Default Study Mode',
          description: 'Your preferred starting study activity',
          type: 'select' as const,
          value: settings.defaultStudyMode,
          options: ['Quiz', 'Summary', 'Flashcards', 'Q&A'],
          onChange: (value: string) => updateSettings({ defaultStudyMode: value }),
        },
        {
          label: 'Motivation Level',
          description: 'Type of motivational approach you prefer',
          type: 'select' as const,
          value: settings.motivationLevel,
          options: ['intense', 'gentle', 'balanced'],
          onChange: (value: string) => updateSettings({ motivationLevel: value as any }),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: 'hsl(var(--tip-primary))',
      items: [
        {
          label: 'Email Notifications',
          description: 'Receive study reminders via email',
          type: 'switch' as const,
          value: settings.emailNotifications,
          onChange: (value: boolean) => updateSettings({ emailNotifications: value }),
        },
        {
          label: 'Notification Frequency',
          description: 'How often to receive reminders',
          type: 'select' as const,
          value: settings.notificationFrequency,
          options: ['daily', 'weekly', 'monthly'],
          onChange: (value: string) => updateSettings({ notificationFrequency: value as any }),
        },
      ],
    },
    {
      title: 'Accessibility',
      icon: Eye,
      color: 'hsl(var(--accent))',
      items: [
        {
          label: 'High Contrast',
          description: 'Increase contrast for better visibility',
          type: 'switch' as const,
          value: settings.highContrast,
          onChange: (value: boolean) => updateSettings({ highContrast: value }),
        },
        {
          label: 'Large Text',
          description: 'Increase text size throughout the app',
          type: 'switch' as const,
          value: settings.largeText,
          onChange: (value: boolean) => updateSettings({ largeText: value }),
        },
      ],
    },
  ];

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
              Settings
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Customize your Study Instant Kit experience to match your learning preferences
          </p>
        </motion.div>

        <div className="space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${section.color}20` }}
                  >
                    <section.icon className="h-6 w-6" style={{ color: section.color }} />
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.label} className="space-y-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>

                      {item.type === 'input' && (
                        <Input
                          value={item.value as string}
                          onChange={(e) => item.onChange(e.target.value)}
                          className="max-w-md"
                        />
                      )}

                      {item.type === 'select' && (
                        <Select 
                          value={item.value as string} 
                          onValueChange={item.onChange}
                        >
                          <SelectTrigger className="max-w-md">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {item.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {item.type === 'slider' && (
                        <div className="max-w-md space-y-2">
                          <Slider
                            value={[item.value as number]}
                            onValueChange={(values) => item.onChange(values[0])}
                            min={item.min}
                            max={item.max}
                            step={item.step}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground text-center">
                            Current: {(item.value as number).toFixed(1)}
                          </div>
                        </div>
                      )}

                      {item.type === 'switch' && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.value as boolean}
                            onCheckedChange={item.onChange}
                          />
                          <span className="text-sm text-muted-foreground">
                            {item.value ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <Shield className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold">Privacy & Data</h2>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </Button>

                  <Button
                    onClick={handleClearData}
                    variant="destructive"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear All Data</span>
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2"><strong>Export Data:</strong> Download your settings and progress as a JSON file.</p>
                  <p><strong>Clear Data:</strong> Permanently delete all your saved data and reset to defaults.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;