'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarDays,
  UtensilsCrossed,
  Star,
  Clock,
  Users,
  Award,
  ChevronRight,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-15, 15, -15],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  const features = [
    {
      icon: CalendarDays,
      title: 'Easy Reservations',
      description: 'Book your table in seconds. Choose your preferred date, time, and party size with our intuitive booking system.',
      color: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: UtensilsCrossed,
      title: 'Pre-Order Food',
      description: 'Browse our menu and pre-order your meals. Skip the wait and enjoy your food as soon as you arrive.',
      color: 'bg-accent/20',
      iconColor: 'text-accent',
    },
    {
      icon: Award,
      title: 'VIP Tables',
      description: 'Experience luxury with our VIP tables featuring premium amenities, butler service, and stunning views.',
      color: 'bg-vip/20',
      iconColor: 'text-vip',
    },
    {
      icon: Clock,
      title: 'Real-Time Availability',
      description: 'Check table availability instantly. Our system updates in real-time to show you the best options.',
      color: 'bg-success/20',
      iconColor: 'text-success',
    },
    {
      icon: Users,
      title: 'Group Bookings',
      description: 'Planning a celebration? Book tables for large groups with special arrangements and customized menus.',
      color: 'bg-warning/20',
      iconColor: 'text-warning',
    },
    {
      icon: Star,
      title: 'Reviews & Ratings',
      description: 'Share your experience and read reviews from other diners to help you choose the perfect spot.',
      color: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar to-sidebar-accent py-20 text-sidebar-foreground lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            variants={pulseVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
            className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl"
          />
        </div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              variants={itemVariants}
              className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Reserve Your Perfect
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-primary"
              >
                {' '}Dining Experience
              </motion.span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-6 text-pretty text-lg text-sidebar-foreground/80 sm:text-xl"
            >
              Discover exquisite cuisine, book your table with ease, and pre-order your favorite dishes. 
              Experience dining like never before with TableReserve.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                asChild
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto"
              >
                <Link href="/reservations">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Book a Table
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full border-sidebar-foreground/20 text-sidebar-foreground transition-all duration-300 hover:scale-105 hover:bg-sidebar-foreground/10 sm:w-auto"
              >
                <Link href="/menu">
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  View Menu
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose TableReserve?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need for a seamless dining experience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                custom={index}
              >
                <Card className="h-full border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </motion.div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-muted py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-between gap-6 lg:flex-row"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Ready to dine with us?
              </h2>
              <p className="mt-2 text-muted-foreground">
                {user
                  ? 'Make a reservation now and enjoy an unforgettable experience.'
                  : 'Create an account to start making reservations and earn rewards.'}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-4"
            >
              {user ? (
                <Button
                  size="lg"
                  asChild
                  className="transition-all duration-300 hover:scale-105"
                >
                  <Link href="/reservations">
                    Make a Reservation
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    size="lg"
                    asChild
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/register">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-border bg-card py-8"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">TableReserve</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Restaurant Table Reservation System - Demonstrating OOP Concepts
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
