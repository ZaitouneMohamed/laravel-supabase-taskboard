import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, Layout, Calendar, Users, Code, ArrowRight, Github, Linkedin, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

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

  // Add mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Add these new states for drag functionality
  const [dragStart, setDragStart] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);

  // Auto slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % steps.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Function to handle drag
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setDragActive(true);
    const position = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(position);
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!dragActive) return;

    const position = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = dragStart - position;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setDragActive(false);
    }
  };

  const handleDragEnd = () => {
    setDragActive(false);
  };

  // Functions to handle slide changes
  const handleNext = () => {
    setSlideDirection('next');
    setCurrentSlide((prev) => (prev + 1) % steps.length);
    setIsAutoPlaying(false);
    setTimeout(() => setSlideDirection(null), 500);
  };

  const handlePrev = () => {
    setSlideDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + steps.length) % steps.length);
    setIsAutoPlaying(false);
    setTimeout(() => setSlideDirection(null), 500);
  };

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
      icon: <Layout className="w-full h-full p-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "02",
      title: "Add Your Tasks",
      description: "Create cards for each task with detailed descriptions, attachments, and deadlines.",
      icon: <Calendar className="w-full h-full p-6" />,
      color: "from-pink-500 to-pink-600"
    },
    {
      number: "03",
      title: "Assign & Collaborate",
      description: "Assign tasks to team members and collaborate with comments and updates.",
      icon: <Users className="w-full h-full p-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Drag cards between columns to visualize progress and keep everyone updated.",
      icon: <CheckCircle className="w-full h-full p-6" />,
      color: "from-green-500 to-green-600"
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

  // Update the renderHowItWorksSlider function
  const renderHowItWorksSlider = () => (
    <div className="relative w-full max-w-xl mx-auto h-[400px] perspective-1000">
      {/* Slides container */}
      <div
        className="relative w-full h-full preserve-3d cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className={cn(
          "absolute inset-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl backface-hidden transition-transform duration-500",
          slideDirection === 'next' && "animate-rotateNext",
          slideDirection === 'prev' && "animate-rotatePrev"
        )}>
          {/* Current Slide Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-6">
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 transition-all duration-500 opacity-20 bg-gradient-to-br",
              steps[currentSlide].color
            )} />

            {/* Icon */}
            <div className={cn(
              "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white transform transition-all duration-500",
              steps[currentSlide].color,
              "animate-scaleIn"
            )}>
              {steps[currentSlide].icon}
            </div>

            {/* Text content */}
            <div className="mt-6 space-y-3 max-w-sm animate-fadeIn text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className={cn(
                  "text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r text-white",
                  steps[currentSlide].color
                )}>
                  {steps[currentSlide].number}
                </span>
                <h3 className={cn(
                  "text-xl font-bold",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  {steps[currentSlide].title}
                </h3>
              </div>
              <p className={cn(
                "text-sm",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}>
                {steps[currentSlide].description}
              </p>
            </div>
          </div>
        </div>

        {/* Next Slide (for cube effect) */}
        <div className={cn(
          "absolute inset-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl backface-hidden transition-transform duration-500",
          slideDirection === 'next' && "animate-rotateInNext",
          slideDirection === 'prev' && "animate-rotateInPrev"
        )}>
          {/* Next/Previous Slide Content (similar structure) */}
          <div className="relative h-full flex flex-col items-center justify-center p-6">
            <div className={cn(
              "absolute inset-0 transition-all duration-500 opacity-20 bg-gradient-to-br",
              steps[(currentSlide + 1) % steps.length].color
            )} />

            <div className={cn(
              "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white",
              steps[(currentSlide + 1) % steps.length].color
            )}>
              {steps[(currentSlide + 1) % steps.length].icon}
            </div>

            <div className="mt-6 space-y-3 max-w-sm text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className={cn(
                  "text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r text-white",
                  steps[(currentSlide + 1) % steps.length].color
                )}>
                  {steps[(currentSlide + 1) % steps.length].number}
                </span>
                <h3 className={cn(
                  "text-xl font-bold",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  {steps[(currentSlide + 1) % steps.length].title}
                </h3>
              </div>
              <p className={cn(
                "text-sm",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}>
                {steps[(currentSlide + 1) % steps.length].description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute -bottom-12 left-0 right-0 flex justify-center items-center space-x-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-gray-800 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation dots */}
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setSlideDirection(index > currentSlide ? 'next' : 'prev');
                setCurrentSlide(index);
                setIsAutoPlaying(false);
                setTimeout(() => setSlideDirection(null), 500);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 transform",
                currentSlide === index
                  ? cn("scale-125 bg-gradient-to-r", steps[index].color)
                  : "bg-gray-300 dark:bg-gray-600 hover:scale-110"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-gray-800 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen overflow-x-hidden",
      theme === "dark" ? "bg-gray-900 text-white" : "bg-background text-foreground"
    )}>
      {/* Enhanced Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-2" : "py-4"
      )}>
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          isScrolled
            ? "bg-background/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        )}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className={cn(
                  "relative px-4 py-2 rounded-lg transition-all duration-300 transform group-hover:scale-105",
                  "bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
                )}>
                  <div className={cn(
                    "font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r",
                    theme === "dark"
                      ? "from-purple-400 to-pink-400"
                      : "from-purple-600 to-pink-600"
                  )}>
                    TZDK Board
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex space-x-8">
                {['Features', 'How it Works', 'Tech Stack'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group relative px-2 py-1"
                  >
                    <span className={cn(
                      "relative z-10 text-sm font-medium transition-colors duration-300",
                      theme === "dark" ? "text-white/80 group-hover:text-white" : "text-foreground/80 group-hover:text-foreground"
                    )}>
                      {item}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100" />
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className={cn(
                    "relative rounded-full w-10 h-10 transition-all duration-300 hover:scale-110",
                    theme === "dark"
                      ? "text-white hover:bg-white/10"
                      : "text-foreground hover:bg-foreground/10",
                    "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:opacity-0 before:transition-opacity hover:before:opacity-20"
                  )}
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                <Button
                  className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  Get Started
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-50 p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={cn(
            "fixed inset-0 z-40 bg-background/80 dark:bg-gray-900/80 backdrop-blur-lg md:hidden transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {['Features', 'How it Works', 'Tech Stack'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                >
                  {item}
                </a>
              ))}
              <Button
                className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative min-h-screen overflow-hidden pt-16">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 dark:from-purple-900/40 dark:to-pink-900/40">
            <div className="absolute inset-0 bg-grid-white/[0.2] dark:bg-grid-white/[0.1]" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 opacity-0 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    Organize Your Work
                  </span>
                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                    Boost Productivity
                  </span>
                </h1>

                <p className={cn(
                  "text-lg md:text-xl max-w-xl",
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                )}>
                  A powerful task board application that helps teams organize, track, and prioritize their work in a flexible, visual way.
                </p>

                <div className="space-y-4">
                  {[
                    'Intuitive drag-and-drop interface',
                    'Real-time updates and collaboration',
                    'Customizable workflows and labels'
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center opacity-0 animate-slideIn"
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                        <div className="absolute h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-ping" />
                        <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className={cn(
                        "ml-3 text-sm md:text-base",
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      )}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "group border-2 hover:scale-105 transition-all duration-300",
                      theme === "dark"
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-purple-600/20 text-purple-600 hover:bg-purple-50"
                    )}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    <span>View on GitHub</span>
                  </Button>
                </div>
              </div>

              {/* Preview Image with 3D effect */}
              <div className="relative flex justify-center opacity-0 animate-fadeIn delay-300">
                <div className="relative w-full max-w-md transform perspective-1000 hover:rotate-y-3 hover:rotate-x-3 transition-transform duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg"></div>
                    <img
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                      alt="Task Board Preview"
                      className="rounded-md w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.fallback-content') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className={cn(
          "py-24 px-4 relative overflow-hidden",
          theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
        )}>
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <div className="absolute inset-0 bg-grid-white/[0.2] dark:bg-grid-white/[0.1]" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-16 opacity-0 animate-fadeIn">
              <h2 className={cn(
                "text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r",
                theme === "dark"
                  ? "from-purple-400 to-pink-400"
                  : "from-purple-600 to-pink-600"
              )}>
                Powerful Features
              </h2>
              <p className={cn(
                "text-lg max-w-2xl mx-auto",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}>
                Designed to enhance productivity and streamline your workflow with intuitive tools and capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const [ref, inView] = useInView({
                  threshold: 0.1,
                  triggerOnce: true
                });

                return (
                  <div
                    key={index}
                    ref={ref}
                    className={cn(
                      "group relative p-6 rounded-xl transition-all duration-500 transform",
                      "hover:scale-105 hover:shadow-xl",
                      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                      theme === "dark"
                        ? "bg-gray-800/50 hover:bg-gray-800/80"
                        : "bg-white hover:bg-white",
                      `delay-[${index * 100}ms]`
                    )}
                  >
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className={cn(
                        "inline-flex p-3 rounded-lg mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                        theme === "dark"
                          ? "bg-purple-900/50 text-purple-400"
                          : "bg-purple-100 text-purple-600"
                      )}>
                        {feature.icon}
                      </div>

                      <h3 className={cn(
                        "text-xl font-bold mb-3 transition-colors duration-300",
                        theme === "dark"
                          ? "text-white group-hover:text-purple-400"
                          : "text-gray-900 group-hover:text-purple-600"
                      )}>
                        {feature.title}
                      </h3>

                      <p className={cn(
                        "transition-colors duration-300",
                        theme === "dark"
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-600 group-hover:text-gray-700"
                      )}>
                        {feature.description}
                      </p>

                      {/* Hover arrow */}
                      <div className={cn(
                        "absolute bottom-6 right-6 opacity-0 transform translate-x-4 transition-all duration-300",
                        "group-hover:opacity-100 group-hover:translate-x-0"
                      )}>
                        <ArrowRight className={cn(
                          "w-5 h-5",
                          theme === "dark" ? "text-purple-400" : "text-purple-600"
                        )} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className={cn(
          "py-24 px-4 min-h-screen relative",
          theme === "dark" ? "bg-gray-900" : "bg-white"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className={cn(
                "text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r",
                theme === "dark"
                  ? "from-purple-400 to-pink-400"
                  : "from-purple-600 to-pink-600"
              )}>
                How It Works
              </h2>
              <p className={cn(
                "text-lg max-w-2xl mx-auto",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}>
                A simple and powerful approach to managing your tasks and projects
              </p>
            </div>

            {/* Render the new slider */}
            {renderHowItWorksSlider()}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className={cn(
          "py-24 px-4 relative overflow-hidden",
          theme === "dark"
            ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30"
            : "bg-gradient-to-r from-indigo-50 to-purple-50"
        )}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r",
                theme === "dark"
                  ? "from-indigo-400 to-purple-400"
                  : "from-indigo-600 to-purple-600"
              )}>
                Built With Modern Tech
              </h2>
              <p className={cn(
                "text-lg max-w-2xl mx-auto",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}>
                Leveraging the power of cutting-edge web technologies to deliver a seamless experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {technologies.map((tech, index) => {
                const [ref, inView] = useInView({
                  threshold: 0.1,
                  triggerOnce: true
                });

                return (
                  <div
                    key={index}
                    ref={ref}
                    className={cn(
                      "group relative p-6 rounded-xl transition-all duration-500",
                      "hover:shadow-xl transform hover:-translate-y-1",
                      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                      theme === "dark"
                        ? "bg-gray-800/50 hover:bg-gray-800/80"
                        : "bg-white hover:bg-white/90",
                      `delay-[${index * 100}ms]`
                    )}
                  >
                    {/* Logo */}
                    <div className="relative h-20 mb-6 flex items-center justify-center">
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        className="h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        theme === "dark"
                          ? "from-gray-800/80 to-transparent"
                          : "from-white/80 to-transparent"
                      )} />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className={cn(
                        "text-xl font-bold mb-2 transition-colors duration-300",
                        theme === "dark"
                          ? "text-white group-hover:text-purple-400"
                          : "text-gray-900 group-hover:text-purple-600"
                      )}>
                        {tech.name}
                      </h3>
                      <p className={cn(
                        "transition-colors duration-300",
                        theme === "dark"
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-600 group-hover:text-gray-700"
                      )}>
                        {tech.description}
                      </p>
                    </div>

                    {/* Hover decoration */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-90" />

          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-8 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Explore My Project?
                </h2>
                <p className="text-lg md:text-xl text-white/90">
                  Check out my Task Board project on GitHub or connect with me on LinkedIn to discuss this and other exciting projects I've been working on.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className={cn(
                      "relative overflow-hidden group bg-white text-purple-600 hover:text-purple-700",
                      "transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    )}
                  >
                    <Github className="mr-2 h-5 w-5" />
                    <span>View on GitHub</span>
                    <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "relative overflow-hidden group border-2 border-white text-white",
                      "hover:bg-white/10 transform transition-all duration-300 hover:scale-105"
                    )}
                  >
                    <Linkedin className="mr-2 h-5 w-5" />
                    <span>Connect on LinkedIn</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
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
