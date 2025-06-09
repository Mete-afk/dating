
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, LogIn, UserPlus, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', age: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast({ title: "Error", description: "Email and password are required.", variant: "destructive" });
        return;
      }
      const success = login(formData.email, formData.password);
      if (success) {
        toast({ title: "Logged In! 🎉", description: "Welcome back to LoveSpark!", className: "bg-green-500 text-white" });
        navigate('/');
      } else {
        toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
      }
    } else { // Signup
      if (!formData.email || !formData.password || !formData.name || !formData.age) {
        toast({ title: "Error", description: "All fields are required for signup.", variant: "destructive" });
        return;
      }
      if (parseInt(formData.age) < 18) {
        toast({ title: "Age Restriction", description: "You must be 18 or older to sign up.", variant: "destructive" });
        return;
      }
      const success = signup(formData.email, formData.password, { name: formData.name, age: formData.age, images: [], interests: [], bio: '', gender: 'female' }); // Default gender
      if (success) {
        toast({ title: "Account Created! 💖", description: "Welcome to LoveSpark! Let's find your match.", className: "bg-pink-500 text-white" });
        navigate('/');
      } else {
        toast({ title: "Signup Failed", description: "This email might already be in use.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 via-rose-500 to-amber-400 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="w-16 h-16 text-white animate-pulse" />
          <Heart className="w-20 h-20 text-white mx-2 transform animate-float" />
          <Sparkles className="w-16 h-16 text-white animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white shadow-lg">LoveSpark</h1>
        <p className="text-xl text-pink-100 mt-2">Find your flame.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md border-pink-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-pink-600">{isLogin ? 'Welcome Back!' : 'Join LoveSpark'}</CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin ? 'Login to continue your journey.' : 'Create an account to start matching.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="name" className="text-pink-700 font-semibold">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Full Name" required={!isLogin} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-pink-700 font-semibold">Age</Label>
                    <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Your Age" required={!isLogin} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email" className="text-pink-700 font-semibold">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div>
                <Label htmlFor="password" className="text-pink-700 font-semibold">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold flex items-center gap-2">
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-pink-600 hover:text-pink-700 font-semibold px-1">
                {isLogin ? 'Sign up' : 'Log in'}
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      <p className="text-center text-pink-200 mt-8 text-sm">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default OnboardingPage;
