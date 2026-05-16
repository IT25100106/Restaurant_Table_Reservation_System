'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/toast-notification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Shield, UtensilsCrossed, User, Lock, AlertTriangle } from 'lucide-react';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const shieldVariants = {
  animate: {
    rotateY: [0, 360],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Check if the logged in user is actually an admin
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.role !== 'admin') {
            showToast('Access denied. Admin credentials required.', 'error');
            localStorage.removeItem('currentUser');
            setIsLoading(false);
            return;
          }
        }
        showToast('Admin login successful! Welcome back.', 'success');
        router.push('/admin');
      } else {
        showToast(result.message, 'error');
      }
    } catch {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated Background - Darker theme for admin */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          variants={pulseVariants}
          animate="animate"
          style={{ animationDelay: '1.5s' }}
          className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-destructive/10 blur-3xl"
        />
        <motion.div
          variants={pulseVariants}
          animate="animate"
          style={{ animationDelay: '3s' }}
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-warning/10 blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div variants={cardVariants}>
          <Card className="border-border/50 bg-card/90 shadow-2xl backdrop-blur-md">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto mb-4"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sidebar to-sidebar/80 shadow-xl">
                  <motion.div
                    variants={shieldVariants}
                    animate="animate"
                    style={{ perspective: 1000 }}
                  >
                    <Shield className="h-10 w-10 text-sidebar-foreground" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-warning shadow-lg"
                >
                  <Lock className="h-3.5 w-3.5 text-warning-foreground" />
                </motion.div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl">Admin Portal</CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription>
                  Secure access for restaurant management
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={itemVariants}
                className="mb-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>This area is restricted to authorized administrators only.</span>
              </motion.div>

              <motion.form
                variants={containerVariants}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@restaurant.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-destructive' : ''}`}
                    />
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="mt-2 w-full bg-sidebar text-sidebar-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-sidebar/90 hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
                      />
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Access Dashboard
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                variants={itemVariants}
                className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <User className="h-4 w-4" />
                <Link href="/login" className="font-medium transition-colors hover:text-foreground hover:underline">
                  User Login
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-4 rounded-lg border border-sidebar/20 bg-sidebar/5 p-4"
              >
                <p className="mb-2 text-sm font-medium text-foreground">Demo Admin Credentials:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Email:</strong> admin@restaurant.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Decorative Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="text-sm">TableReserve Admin</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
