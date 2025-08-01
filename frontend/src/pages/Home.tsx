import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Clock, 
  Target,
  TrendingUp,
  Zap,
  Play
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroBackground from '@/assets/hero-background.png';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { stats, settings } = useUser();

  const statCards = [
    {
      title: 'Quizzes Taken',
      value: stats.quizzesTaken,
      subtitle: 'Great progress!',
      icon: Target,
      color: 'hsl(var(--quiz-primary))',
    },
    {
      title: 'Questions Answered',
      value: stats.questionsAnswered,
      subtitle: 'Knowledge building',
      icon: Brain,
      color: 'hsl(var(--summary-primary))',
    },
    {
      title: 'Summaries Created',
      value: stats.summariesGenerated,
      subtitle: 'Content mastered',
      icon: BookOpen,
      color: 'hsl(var(--flashcard-primary))',
    },
    {
      title: 'Study Time',
      value: `${stats.totalStudyTime}min`,
      subtitle: 'Time invested',
      icon: Clock,
      color: 'hsl(var(--tip-primary))',
    },
  ];
  const navigator = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold"
                >
                  Hello, 
                  <span className="bg-gradient-to-r p-2 from-primary to-accent bg-clip-text text-transparent">
                    {settings.username} !
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-xl text-muted-foreground leading-relaxed"
                >
                  Welcome back to your AI-powered study companion. 
                  Ready to unlock your learning potential today?
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" className="study-button" onClick={() => navigator('/edu-extract')}>
                  <Zap className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
                <a href="#progress">
                <Button variant="outline" size="lg" className="border-border hover:bg-primary/5">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Progress
                </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <Card className="overflow-hidden shadow-lg">
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 
                               flex items-center justify-center group cursor-pointer
                               hover:from-primary/20 hover:to-accent/20 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-primary text-primary-foreground p-6 rounded-full 
                               shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </motion.div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Study Instant Kit Demo
                    </h3>
                    <p className="text-sm text-muted-foreground" id="progress">
                      1-minute overview of your AI study companion
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Your Learning Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress and celebrate your achievements. Every study session brings you closer to your goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <StatCard key={stat.title} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Quick Actions</h2>
            <p className="text-lg text-muted-foreground">
              Jump into your favorite study activities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Generate Quiz',
                description: 'Test your knowledge with AI-powered questions',
                icon: Target,
                color: 'hsl(var(--quiz-primary))',
                path: '/edu-extract',
              },
              {
                title: 'Get Study Tips',
                description: 'Personalized motivation and learning strategies',
                icon: Zap,
                color: 'hsl(var(--tip-primary))',
                path: '/study-tip',
              },
              {
                title: 'Create Summary',
                description: 'Extract key insights from any content',
                icon: BookOpen,
                color: 'hsl(var(--summary-primary))',
                path: '/edu-extract',
              },
            ].map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="feature-card group text-center p-8"
              >
                <div 
                  className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                             shadow-lg group-hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <action.icon className="h-8 w-8" style={{ color: action.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{action.title}</h3>
                <p className="text-muted-foreground mb-6">{action.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground
                           transition-all duration-300" onClick={() => navigator(action.path)}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;