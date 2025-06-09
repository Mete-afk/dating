
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { User, Edit3, Save, ImagePlus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const initialInterests = ["Hiking", "Reading", "Cooking", "Gaming", "Traveling", "Music", "Art", "Sports", "Movies", "Photography", "Yoga", "Coding"];

const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    bio: '',
    images: [],
    interests: [],
    gender: 'female', // Default or load from user
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.profile) {
      setProfileData({
        name: currentUser.profile.name || '',
        age: currentUser.profile.age || '',
        bio: currentUser.profile.bio || '',
        images: currentUser.profile.images || [],
        interests: currentUser.profile.interests || [],
        gender: currentUser.profile.gender || 'female',
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageAdd = () => {
    if (newImageUrl.trim() && profileData.images.length < 5) {
      // Basic URL validation
      if (!newImageUrl.match(/\.(jpeg|jpg|gif|png)$/i) && !newImageUrl.startsWith('https://source.unsplash.com/random')) {
         toast({ title: "Invalid Image URL", description: "Please enter a valid image URL (jpg, png, gif).", variant: "destructive" });
         return;
      }
      setProfileData((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl('');
      toast({ title: "Image Added!", description: "Your new picture looks great." });
    } else if (profileData.images.length >= 5) {
      toast({ title: "Max Images Reached", description: "You can add up to 5 images.", variant: "destructive" });
    }
  };

  const handleImageRemove = (index) => {
    setProfileData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast({ title: "Image Removed", description: "Picture has been removed." });
  };

  const handleInterestToggle = (interest) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };
  
  const handleAddCustomInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim()) && profileData.interests.length < 10) {
      setProfileData(prev => ({ ...prev, interests: [...prev.interests, newInterest.trim()] }));
      setNewInterest('');
      toast({ title: "Interest Added!", description: `${newInterest.trim()} added to your interests.` });
    } else if (profileData.interests.length >= 10) {
       toast({ title: "Max Interests", description: "You can add up to 10 interests.", variant: "destructive" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.age) {
      toast({ title: "Missing Info", description: "Name and Age are required.", variant: "destructive" });
      return;
    }
    updateUserProfile(profileData);
    setIsEditing(false);
    toast({
      title: 'Profile Updated! ✨',
      description: 'Your changes have been saved successfully.',
      className: "bg-green-500 text-white"
    });
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
          <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center mb-4 shadow-lg ring-2 ring-white">
            {profileData.images && profileData.images.length > 0 ? (
              <img  src={profileData.images[0]} alt="Profile" className="w-full h-full rounded-full object-cover" src="https://images.unsplash.com/photo-1652841190565-b96e0acbae17" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold text-pink-600">{isEditing ? "Edit Your Profile" : (profileData.name || "Your Profile")}</CardTitle>
          <CardDescription className="text-gray-600">
            {isEditing ? "Let the world know who you are!" : "This is how others will see you."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-pink-700 font-semibold">Name</Label>
                <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} placeholder="Your Name" className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div>
                <Label htmlFor="age" className="text-pink-700 font-semibold">Age</Label>
                <Input id="age" name="age" type="number" value={profileData.age} onChange={handleInputChange} placeholder="Your Age" className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div>
                <Label htmlFor="gender" className="text-pink-700 font-semibold">Gender</Label>
                <select id="gender" name="gender" value={profileData.gender} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-pink-300 rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="bio" className="text-pink-700 font-semibold">Bio</Label>
                <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} placeholder="Tell us about yourself..." rows={4} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              
              <div>
                <Label className="text-pink-700 font-semibold">Your Pictures (up to 5)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {profileData.images.map((img, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img  src={img} alt={`Profile image ${index + 1}`} className="w-full h-full object-cover rounded-md shadow" src="https://images.unsplash.com/photo-1604703021135-92b25e6415e4" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleImageRemove(index)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {profileData.images.length < 5 && (
                     <div className="aspect-square border-2 border-dashed border-pink-300 rounded-md flex items-center justify-center">
                       <ImagePlus className="w-8 h-8 text-pink-400" />
                     </div>
                  )}
                </div>
                {profileData.images.length < 5 && (
                  <div className="flex mt-2 gap-2">
                    <Input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Image URL (e.g., from Unsplash)" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
                    <Button type="button" onClick={handleImageAdd} className="bg-pink-500 hover:bg-pink-600 text-white shrink-0">Add</Button>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-pink-700 font-semibold">Your Interests (up to 10)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {initialInterests.map((interest) => (
                    <Button
                      type="button"
                      key={interest}
                      variant={profileData.interests.includes(interest) ? 'default' : 'outline'}
                      onClick={() => handleInterestToggle(interest)}
                      className={`rounded-full text-sm ${profileData.interests.includes(interest) ? 'bg-pink-500 text-white border-pink-500' : 'border-pink-300 text-pink-600 hover:bg-pink-100'}`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                 {profileData.interests.length < 10 && (
                  <div className="flex mt-3 gap-2">
                    <Input value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Add custom interest" className="border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
                    <Button type="button" onClick={handleAddCustomInterest} className="bg-pink-500 hover:bg-pink-600 text-white shrink-0">Add</Button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{profileData.interests.length}/10 interests selected.</p>
              </div>

              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold flex items-center gap-2">
                <Save className="w-5 h-5" /> Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-lg text-gray-800">{profileData.name || 'Not set'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Age</h3>
                <p className="text-lg text-gray-800">{profileData.age || 'Not set'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                <p className="text-lg text-gray-800 capitalize">{profileData.gender || 'Not set'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                <p className="text-lg text-gray-800 whitespace-pre-wrap">{profileData.bio || 'No bio yet. Tell us about yourself!'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Pictures</h3>
                {profileData.images && profileData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {profileData.images.map((img, index) => (
                      <div key={index} className="aspect-square">
                        <img  src={img} alt={`Profile image ${index + 1}`} className="w-full h-full object-cover rounded-md shadow" src="https://images.unsplash.com/photo-1604703021135-92b25e6415e4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No pictures added yet.</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
                {profileData.interests && profileData.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest) => (
                      <span key={interest} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">{interest}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No interests selected yet.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"} size="lg" className={`w-full font-semibold flex items-center gap-2 ${isEditing ? 'border-pink-500 text-pink-600 hover:bg-pink-50' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'}`}>
            {isEditing ? (
              <>Cancel</>
            ) : (
              <><Edit3 className="w-5 h-5" /> Edit Profile</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;
