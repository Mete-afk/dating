
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SlidersHorizontal, Bell, Shield, LogOut, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const { currentUser, logout, deleteAccount } = useAuth();
  const { toast } = useToast();

  const initialSettings = {
    discoveryGender: ['female', 'male', 'other'], // What genders to show user
    showMeOnApp: true,
    ageRange: [18, 55],
    distance: 50, // in miles
    notifications: {
      newMatches: true,
      newMessages: true,
      promotions: false,
    },
  };

  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    if (currentUser) {
      const storedSettings = JSON.parse(localStorage.getItem(`userSettings_${currentUser.id}`));
      if (storedSettings) {
        setSettings(prev => ({...prev, ...storedSettings}));
      } else {
        // Save initial settings if none exist
        localStorage.setItem(`userSettings_${currentUser.id}`, JSON.stringify(initialSettings));
      }
    }
  }, [currentUser]);

  const handleGenderToggle = (gender) => {
    setSettings(prev => {
      const newDiscoveryGender = prev.discoveryGender.includes(gender)
        ? prev.discoveryGender.filter(g => g !== gender)
        : [...prev.discoveryGender, gender];
      return { ...prev, discoveryGender: newDiscoveryGender };
    });
  };

  const handleSwitchChange = (category, key) => {
    if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: !prev[category][key],
        },
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleSliderChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    if (currentUser) {
      if (settings.discoveryGender.length === 0) {
        toast({ title: "Selection Needed", description: "Please select at least one gender for discovery.", variant: "destructive" });
        return;
      }
      localStorage.setItem(`userSettings_${currentUser.id}`, JSON.stringify(settings));
      toast({ title: 'Settings Saved! ✨', description: 'Your preferences have been updated.', className: "bg-green-500 text-white" });
    }
  };

  const handleLogout = () => {
    logout();
    // Navigate to login/onboarding, usually handled by AuthContext/Router
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const handleDeleteAccount = () => {
    deleteAccount();
    toast({ title: "Account Deleted", description: "Your account has been permanently deleted.", variant: "destructive" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-xl bg-white/90 backdrop-blur-lg border-pink-200">
        <CardHeader className="text-center">
          <SlidersHorizontal className="w-12 h-12 text-pink-500 mx-auto mb-3" />
          <CardTitle className="text-3xl font-bold text-pink-600">App Settings</CardTitle>
          <CardDescription className="text-gray-600">Customize your LoveSpark experience.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Discovery Settings */}
          <section>
            <h3 className="text-xl font-semibold text-pink-700 mb-3">Discovery</h3>
            <div className="space-y-4">
              <div>
                <Label className="font-medium text-gray-700">Show me people who are:</Label>
                <div className="flex space-x-4 mt-2">
                  {['female', 'male', 'other'].map(gender => (
                    <Button
                      key={gender}
                      variant={settings.discoveryGender.includes(gender) ? 'default' : 'outline'}
                      onClick={() => handleGenderToggle(gender)}
                      className={`capitalize rounded-full ${settings.discoveryGender.includes(gender) ? 'bg-pink-500 text-white' : 'border-pink-300 text-pink-600 hover:bg-pink-100'}`}
                    >
                      {gender}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showMeOnApp" className="font-medium text-gray-700">Show me on LoveSpark</Label>
                <Switch id="showMeOnApp" checked={settings.showMeOnApp} onCheckedChange={() => handleSwitchChange(null, 'showMeOnApp')} className="data-[state=checked]:bg-pink-500" />
              </div>
              <div>
                <Label htmlFor="ageRange" className="font-medium text-gray-700">Age Range: {settings.ageRange[0]} - {settings.ageRange[1]}</Label>
                <Slider
                  id="ageRange"
                  min={18} max={80} step={1}
                  value={settings.ageRange}
                  onValueChange={(value) => handleSliderChange('ageRange', value)}
                  className="mt-2 [&>span:first-child]:h-1 [&>span:first-child>span]:bg-pink-500 [&>span>span[role=slider]]:bg-pink-600 [&>span>span[role=slider]]:border-pink-600"
                />
              </div>
              <div>
                <Label htmlFor="distance" className="font-medium text-gray-700">Maximum Distance: {settings.distance} miles</Label>
                <Slider
                  id="distance"
                  min={1} max={100} step={1}
                  value={[settings.distance]}
                  onValueChange={(value) => handleSliderChange('distance', value[0])}
                  className="mt-2 [&>span:first-child]:h-1 [&>span:first-child>span]:bg-pink-500 [&>span>span[role=slider]]:bg-pink-600 [&>span>span[role=slider]]:border-pink-600"
                />
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section>
            <h3 className="text-xl font-semibold text-pink-700 mb-3 flex items-center"><Bell className="w-5 h-5 mr-2" /> Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifMatches" className="font-medium text-gray-700">New Matches</Label>
                <Switch id="notifMatches" checked={settings.notifications.newMatches} onCheckedChange={() => handleSwitchChange('notifications', 'newMatches')} className="data-[state=checked]:bg-pink-500" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifMessages" className="font-medium text-gray-700">New Messages</Label>
                <Switch id="notifMessages" checked={settings.notifications.newMessages} onCheckedChange={() => handleSwitchChange('notifications', 'newMessages')} className="data-[state=checked]:bg-pink-500" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifPromos" className="font-medium text-gray-700">Promotions & Announcements</Label>
                <Switch id="notifPromos" checked={settings.notifications.promotions} onCheckedChange={() => handleSwitchChange('notifications', 'promotions')} className="data-[state=checked]:bg-pink-500" />
              </div>
            </div>
          </section>
          
          {/* Account Settings */}
          <section>
            <h3 className="text-xl font-semibold text-pink-700 mb-3 flex items-center"><Shield className="w-5 h-5 mr-2" /> Account</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-pink-300 text-pink-600 hover:bg-pink-50" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full justify-start bg-red-500 hover:bg-red-600 text-white">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white rounded-lg shadow-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-gray-100">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">Delete Account</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>

        </CardContent>

        <CardFooter>
          <Button onClick={handleSaveSettings} size="lg" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold">
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;
