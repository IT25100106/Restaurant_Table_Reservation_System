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
import { Eye, EyeOff, LogIn, UtensilsCrossed, User, Shield } from 'lucide-react';

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

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function UserLoginPage() {
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
        showToast('Login successful! Welcome back.', 'success');
        router.push('/');
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '4s' }}
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/5 blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div variants={cardVariants}>
          <Card className="border-border/50 bg-card/80 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg"
              >
                <User className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl">User Login</CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription>
                  Sign in to book tables and order food
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.form
                variants={containerVariants}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`transition-all duration-300 focus:scale-[1.01] ${errors.email ? 'border-destructive' : ''}`}
                  />
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pr-10 transition-all duration-300 focus:scale-[1.01] ${errors.password ? 'border-destructive' : ''}`}
                    />
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
                    className="mt-2 w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
                        Sign In
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">{"Don't have an account? "}</span>
                <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline">
                  Sign up
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Shield className="h-4 w-4" />
                <Link href="/admin/login" className="font-medium transition-colors hover:text-foreground hover:underline">
                  Admin Login
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-4 rounded-lg bg-muted/50 p-4"
              >
                <p className="mb-2 text-sm font-medium text-muted-foreground">Demo User Credentials:</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> user@example.com / <strong>Password:</strong> user123
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="text-sm">TableReserve</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
