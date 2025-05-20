import React, { useEffect, useState } from 'react';
import { CheckCircle, Layout, Calendar, Users, Code, ArrowRight, Github, Linkedin, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) return savedTheme;

      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      duration: 2000
    });
  };

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  // Function to handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-fadeIn');

      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight * 0.85;

        if (elementPosition < screenPosition) {
          element.classList.add('opacity-100');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Features data
  const features = [
    {
      title: "Intuitive Board Layout",
      description: "Drag-and-drop interface makes organizing tasks simple and visual, with customizable columns and cards.",
      icon: <Layout size={24} />,
      delay: "delay-100"
    },
    {
      title: "Deadline Management",
      description: "Set due dates, reminders, and track progress on all your tasks with our powerful calendar integration.",
      icon: <Calendar size={24} />,
      delay: "delay-200"
    },
    {
      title: "Team Collaboration",
      description: "Assign tasks, add comments, and collaborate in real-time with your team members on any project.",
      icon: <Users size={24} />,
      delay: "delay-300"
    },
    {
      title: "Developer Friendly",
      description: "Built with Laravel and Inertia.js for a modern, responsive, and highly performant user experience.",
      icon: <Code size={24} />,
      delay: "delay-400"
    }
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Create Your Board",
      description: "Set up your task board with custom columns that match your workflow process.",
      delay: "delay-100"
    },
    {
      number: "02",
      title: "Add Your Tasks",
      description: "Create cards for each task with detailed descriptions, attachments, and deadlines.",
      delay: "delay-200"
    },
    {
      number: "03",
      title: "Assign & Collaborate",
      description: "Assign tasks to team members and collaborate with comments and updates.",
      delay: "delay-300"
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Drag cards between columns to visualize progress and keep everyone updated.",
      delay: "delay-400"
    }
  ];

  // Tech stack data
  const technologies = [
    {
      name: "Laravel",
      description: "A robust PHP framework with expressive syntax for building web applications",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/1200px-Laravel.svg.png",
      delay: "delay-100"
    },
    {
      name: "Inertia.js",
      description: "The modern approach to building classic server-driven web apps",
      logo: "https://avatars.githubusercontent.com/u/47703742?s=280&v=4",
      delay: "delay-200"
    },
    {
      name: "React",
      description: "A JavaScript library for building user interfaces with components",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png",
      delay: "delay-300"
    },
    {
      name: "Tailwind CSS",
      description: "A utility-first CSS framework for rapid UI development",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2048px-Tailwind_CSS_Logo.svg.png",
      delay: "delay-400"
    }
  ];

  return (
    <div className={cn(
      "min-h-screen overflow-x-hidden",
      theme === "dark" ? "bg-gray-900 text-white" : "bg-background text-foreground"
    )}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 dark:bg-gray-700 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className={cn(
              "font-bold text-xl transition-colors duration-300",
              theme === "dark" ? "text-white" : "text-foreground"
            )}>TaskFlow</div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex space-x-8">
                {['Features', 'How it Works', 'Tech Stack'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className={cn(
                      "transition-colors duration-300 hover:text-accent relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
                      theme === "dark" ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-foreground"
                    )}
                  >
                    {item}
                  </a>
                ))}
              </nav>
              {/* Theme toggle button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={cn(
                  "rounded-full transition-all hover:scale-110",
                  theme === "dark" ? "text-white hover:bg-white/10" : "text-foreground hover:bg-foreground/10"
                )}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16">
          <div className="absolute inset-0 z-0 gradient-bg opacity-90"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 opacity-0 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight animate-fadeIn">
                  Streamline Your Tasks, Boost Your Productivity
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-xl">
                  A powerful task board application built with Laravel and Inertia that helps teams organize, track, and prioritize their work in a flexible, visual way.
                </p>

                <div className="space-y-3">
                  {[
                    'Intuitive drag-and-drop interface',
                    'Real-time updates and collaboration',
                    'Customizable workflows and labels'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center opacity-0 animate-slideIn" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-white text-accent hover:bg-white/90 animate-pulse-slow hover:scale-105 transition-transform">
                    View Project
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10 hover:scale-105 transition-transform">
                    GitHub Repository
                  </Button>
                </div>
              </div>

              <div className="relative flex justify-center opacity-0 animate-fadeIn delay-300">
                <div className="relative w-full max-w-md">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl animate-float">
                    <img
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                      alt="Task Board Preview"
                      className="rounded-md w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className={cn(
          "py-24 px-4",
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        )}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 opacity-0 animate-fadeIn">
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                theme === "dark" ? "text-white" : "text-foreground"
              )}>Powerful Features</h2>
              <p className={cn(
                "text-lg max-w-2xl mx-auto",
                theme === "dark" ? "text-gray-300" : "text-muted-foreground"
              )}>
                Designed to enhance productivity and streamline your workflow with intuitive tools and capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-start p-6 rounded-xl shadow-lg opacity-0 animate-fadeIn hover:scale-105 transition-all duration-300",
                    feature.delay,
                    theme === "dark" ? "bg-gray-700 text-white hover:shadow-purple-500/20" : "bg-white text-foreground hover:shadow-purple-500/10"
                  )}
                >
                  <div className={cn(
                    "p-3 mb-4 rounded-full text-accent",
                    theme === "dark" ? "bg-purple-900/50" : "bg-purple-100"
                  )}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className={theme === "dark" ? "text-gray-300" : "text-muted-foreground"}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className={cn(
          "py-24 px-4",
          theme === "dark" ? "bg-gray-900" : "bg-white"
        )}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 opacity-0 animate-fadeIn">
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                theme === "dark" ? "text-white" : "text-foreground"
              )}>How It Works</h2>
              <p className={cn(
                "text-lg max-w-2xl mx-auto",
                theme === "dark" ? "text-gray-300" : "text-muted-foreground"
              )}>
                A simple and powerful approach to managing your tasks and projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className={`relative opacity-0 animate-fadeIn ${step.delay}`}>
                  <div className={cn(
                    "rounded-xl p-8 shadow-md h-full border",
                    theme === "dark" ?
                      "bg-gray-800 border-gray-700 hover:border-purple-500/50" :
                      "bg-white border-gray-100 hover:border-purple-500/30",
                    "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  )}>
                    <div className={cn(
                      "text-5xl font-bold mb-4",
                      theme === "dark" ? "text-purple-400" : "text-purple-200"
                    )}>{step.number}</div>
                    <h3 className={cn(
                      "text-xl font-bold mb-2",
                      theme === "dark" ? "text-white" : "text-foreground"
                    )}>{step.title}</h3>
                    <p className={
                      theme === "dark" ? "text-gray-300" : "text-muted-foreground"
                    }>{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-accent rounded-full p-2 text-white animate-pulse">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 text-center opacity-0 animate-fadeIn delay-500">
              <div className="relative inline-block">
                <div className="animate-pulse-slow">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                      alt="Task Board in Action"
                      className="w-full max-w-3xl mx-auto rounded-xl"
                    />
                    <div className={cn(
                      "absolute inset-0",
                      theme === "dark" ?
                        "bg-gradient-to-r from-purple-800/30 to-blue-700/30" :
                        "bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                    )}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className={cn(
          "py-24 px-4",
          theme === "dark" ?
            "bg-gradient-to-r from-indigo-900/30 to-purple-900/30" :
            "bg-gradient-to-r from-indigo-500/5 to-purple-500/5"
        )}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 opacity-0 animate-fadeIn">
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                theme === "dark" ? "text-white" : "text-foreground"
              )}>Built With Modern Tech</h2>
              <p className={cn(
                "text-lg max-w-2xl mx-auto",
                theme === "dark" ? "text-gray-300" : "text-muted-foreground"
              )}>
                Leveraging the power of cutting-edge web technologies to deliver a seamless experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center p-6 rounded-xl shadow-sm opacity-0 animate-fadeIn hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1",
                    tech.delay,
                    theme === "dark" ? "bg-gray-800 hover:shadow-purple-500/20" : "bg-white hover:shadow-purple-500/10"
                  )}
                >
                  <img src={tech.logo} alt={tech.name} className="h-16 mb-4 object-contain" />
                  <h3 className={cn(
                    "text-xl font-bold mb-2",
                    theme === "dark" ? "text-white" : "text-foreground"
                  )}>{tech.name}</h3>
                  <p className={cn(
                    "text-center",
                    theme === "dark" ? "text-gray-300" : "text-muted-foreground"
                  )}>{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-90"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-8 max-w-3xl opacity-0 animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Explore My Project?</h2>
                <p className="text-lg md:text-xl text-white/80">
                  Check out my Task Board project on GitHub or connect with me on LinkedIn to discuss this and other exciting projects I've been working on.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-accent hover:bg-white/90 gap-2 hover:scale-105 transition-transform">
                    <Github size={18} />
                    <span>View on GitHub</span>
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10 gap-2 hover:scale-105 transition-transform">
                    <Linkedin size={18} />
                    <span>Connect on LinkedIn</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={cn(
        "py-12",
        theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-900 text-white"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <div className="font-bold text-xl mb-2">TaskFlow</div>
              <p className="text-gray-400">A powerful task management board built with Laravel & Inertia</p>
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-gray-400">&copy; {new Date().getFullYear()} - All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
