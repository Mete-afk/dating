import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { X, Heart, MessageSquare, Settings, User, Sparkles, RotateCcw, Zap, HeartCrack } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const initialProfiles = [
  { id: '1', name: 'Alex', age: 28, bio: 'Loves hiking and dogs. Looking for adventure!', images: ['https://source.unsplash.com/random/400x600?person,hiking', 'https://source.unsplash.com/random/400x600?person,nature'], interests: ['Hiking', 'Dogs', 'Travel'], gender: 'Male' },
  { id: '2', name: 'Jamie', age: 25, bio: 'Artist and musician. Coffee enthusiast.', images: ['https://source.unsplash.com/random/400x600?person,art', 'https://source.unsplash.com/random/400x600?person,music'], interests: ['Art', 'Music', 'Coffee'], gender: 'Female' },
  { id: '3', name: 'Casey', age: 30, bio: 'Tech geek, loves gaming and sci-fi movies.', images: ['https://source.unsplash.com/random/400x600?person,technology', 'https://source.unsplash.com/random/400x600?person,gaming'], interests: ['Gaming', 'Sci-Fi', 'Tech'], gender: 'Other' },
  { id: '4', name: 'Morgan', age: 22, bio: 'Foodie and travel blogger. Always up for trying new things.', images: ['https://source.unsplash.com/random/400x600?person,food', 'https://source.unsplash.com/random/400x600?person,traveling'], interests: ['Food', 'Travel', 'Blogging'], gender: 'Female' },
  { id: '5', name: 'Riley', age: 27, bio: 'Fitness instructor and yoga enthusiast.', images: ['https://source.unsplash.com/random/400x600?person,fitness', 'https://source.unsplash.com/random/400x600?person,yoga'], interests: ['Fitness', 'Yoga', 'Health'], gender: 'Male' },
];

const HomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSwipeDirection, setLastSwipeDirection] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [swipedProfiles, setSwipedProfiles] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/onboarding');
      return;
    }

    const storedUserPreferences = JSON.parse(localStorage.getItem(`userSettings_${currentUser.id}`));
    const preferencesToUse = storedUserPreferences || {
        discoveryGender: ['female', 'male', 'other'],
        ageRange: [18, 55],
    };
    setUserPreferences(preferencesToUse);


    const storedSwipedProfiles = JSON.parse(localStorage.getItem(`swipedProfiles_${currentUser.id}`)) || [];
    setSwipedProfiles(storedSwipedProfiles);
    
    const availableProfiles = initialProfiles.filter(p => p.id !== currentUser.id && !storedSwipedProfiles.find(sp => sp.id === p.id));
    
    const filteredProfiles = availableProfiles.filter(profile => {
      const meetsGender = preferencesToUse.discoveryGender.includes(profile.gender) || preferencesToUse.discoveryGender.includes('any'); // Assuming 'any' could be an option
      const meetsAge = profile.age >= preferencesToUse.ageRange[0] && profile.age <= preferencesToUse.ageRange[1];
      return meetsGender && meetsAge;
    });

    setProfiles(filteredProfiles.length > 0 ? filteredProfiles : [{id: 'placeholder', name: 'No More Profiles', age: 0, bio: 'Adjust your settings or check back later!', images: [], interests: [], gender: 'All'}]);
    setCurrentIndex(0);
    setImageIndex(0);

  }, [currentUser, navigate]);

  const saveSwipe = (profileId, direction) => {
    const newSwipedProfiles = [...swipedProfiles, { id: profileId, swipe: direction, date: new Date().toISOString() }];
    setSwipedProfiles(newSwipedProfiles);
    localStorage.setItem(`swipedProfiles_${currentUser.id}`, JSON.stringify(newSwipedProfiles));
  };

  const handleSwipe = useCallback((direction) => {
    if (profiles.length === 0 || profiles[currentIndex]?.id === 'placeholder') {
      toast({ title: "No more profiles!", description: "Try adjusting your filters or check back later.", variant: "destructive" });
      return;
    }

    setLastSwipeDirection(direction);
    const swipedProfile = profiles[currentIndex];
    saveSwipe(swipedProfile.id, direction);

    let userSwipes = JSON.parse(localStorage.getItem(`userSwipes_${currentUser.id}`)) || {};
    userSwipes[swipedProfile.id] = direction;
    localStorage.setItem(`userSwipes_${currentUser.id}`, JSON.stringify(userSwipes));

    const otherUserSwipesKey = `userSwipes_${swipedProfile.id}`;
    const otherUserSwipes = JSON.parse(localStorage.getItem(otherUserSwipesKey)) || {};
    const otherUserSwipeOnCurrentUser = otherUserSwipes[currentUser.id];


    let matchesKey = `matches_${currentUser.id}`;
    let negativeChatsKey = `negativeChats_${currentUser.id}`;
    let currentMatches = JSON.parse(localStorage.getItem(matchesKey)) || [];
    let currentNegativeChats = JSON.parse(localStorage.getItem(negativeChatsKey)) || [];

    if (direction === 'right' && otherUserSwipeOnCurrentUser === 'right') {
      toast({
        title: "It's a Match! 💖",
        description: `You and ${swipedProfile.name} both liked each other!`,
        action: <Button onClick={() => navigate('/matches')}>View Matches</Button>,
      });
      if (!currentMatches.find(m => m.id === swipedProfile.id)) {
        currentMatches.push(swipedProfile);
        localStorage.setItem(matchesKey, JSON.stringify(currentMatches));
      }
    } else if (direction === 'left' && otherUserSwipeOnCurrentUser === 'left') {
        toast({
            title: "Mutual Pass... Interesting! 🤔",
            description: `You and ${swipedProfile.name} both passed. A 'Negative Chat' has started.`,
            action: <Button onClick={() => navigate('/matches', { state: { activeTab: 'negative-chats' } })}>View Negative Chats</Button>,
        });
        if (!currentNegativeChats.find(nc => nc.id === swipedProfile.id)) {
            currentNegativeChats.push(swipedProfile);
            localStorage.setItem(negativeChatsKey, JSON.stringify(currentNegativeChats));
        }
    } else if (direction === 'right') {
      toast({ title: "Liked! 👍", description: `You liked ${swipedProfile.name}.` });
    } else {
      toast({ title: "Passed. 👎", description: `You passed on ${swipedProfile.name}.` });
    }

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < profiles.length) {
        setCurrentIndex(nextIndex);
        setImageIndex(0); 
      } else {
         setProfiles([{id: 'placeholder', name: 'No More Profiles', age: 0, bio: 'Adjust your settings or check back later!', images: [], interests: [], gender: 'All'}]);
         setCurrentIndex(0);
         setImageIndex(0);
      }
      setLastSwipeDirection(null);
    }, 300);
  }, [currentIndex, profiles, currentUser, navigate, toast, swipedProfiles]);


  const currentProfile = profiles[currentIndex];

  if (!currentUser || !userPreferences) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-4">
        <Sparkles className="w-12 h-12 text-white animate-spin" />
        <p className="ml-4 text-white text-xl">Loading your Spark...</p>
      </div>
    );
  }
  
  if (!currentProfile) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-4 text-white">
        <Zap className="w-24 h-24 text-yellow-300 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Out of Sparks!</h1>
        <p className="text-xl mb-6 text-center">No more profiles match your current criteria.</p>
        <Button onClick={() => navigate('/settings')} className="bg-white text-pink-600 hover:bg-gray-100">
          <Settings className="mr-2 h-5 w-5" /> Adjust Settings
        </Button>
      </div>
    );
  }

  const cardVariants = {
    initial: (direction) => ({
      x: direction === 'right' ? 300 : direction === 'left' ? -300 : 0,
      opacity: 0,
      rotate: direction === 'right' ? 20 : direction === 'left' ? -20 : 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
    exit: (direction) => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
      rotate: direction === 'right' ? 30 : -30,
      transition: { duration: 0.3 },
    }),
  };
  
  const nextImage = (e) => {
    e.stopPropagation();
    if (currentProfile.images && currentProfile.images.length > 0) {
      setImageIndex((prev) => (prev + 1) % currentProfile.images.length);
    }
  };
  const prevImage = (e) => {
    e.stopPropagation();
    if (currentProfile.images && currentProfile.images.length > 0) {
      setImageIndex((prev) => (prev - 1 + currentProfile.images.length) % currentProfile.images.length);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] md:min-h-screen bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-4 overflow-hidden">
      <AnimatePresence custom={lastSwipeDirection} initial={false}>
        {currentProfile && (
          <motion.div
            key={currentProfile.id || currentIndex}
            custom={lastSwipeDirection}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="x"
            dragConstraints={{ left: -200, right: 200 }}
            onDragEnd={(event, info) => {
              if (info.offset.x > 100) {
                handleSwipe('right');
              } else if (info.offset.x < -100) {
                handleSwipe('left');
              }
            }}
            className="w-full max-w-sm relative"
          >
            <Card className="overflow-hidden shadow-2xl rounded-3xl border-4 border-white/50 glassmorphic-card">
              <CardHeader className="p-0 relative">
                {currentProfile.id === 'placeholder' ? (
                   <div className="w-full h-[450px] bg-gray-700 flex flex-col items-center justify-center text-white p-4 rounded-t-3xl">
                     <Zap size={64} className="mb-4 text-yellow-300"/>
                     <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                     <p className="text-center">{currentProfile.bio}</p>
                   </div>
                ) : (
                  <>
                    <img
                      alt={currentProfile.name || "Profile image"}
                      className="w-full h-[450px] object-cover rounded-t-3xl"
                      src={currentProfile.images?.[imageIndex] || "https://source.unsplash.com/random/400x600?person,silhouette"}
                    />
                    {currentProfile.images && currentProfile.images.length > 1 && (
                      <>
                        <Button onClick={prevImage} variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10">
                          {'<'}
                        </Button>
                        <Button onClick={nextImage} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10">
                          {'>'}
                        </Button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                          {currentProfile.images.map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === imageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}></div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  {currentProfile.age}
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white/80 backdrop-blur-md rounded-b-3xl">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">{currentProfile.name}</CardTitle>
                <CardDescription className="text-gray-600 min-h-[60px] mb-4">{currentProfile.bio}</CardDescription>
                {currentProfile.interests && currentProfile.interests.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-1">Interests:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map(interest => (
                        <span key={interest} className="bg-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {profiles.length > 0 && currentProfile?.id !== 'placeholder' && (
        <div className="mt-8 flex space-x-6">
          <Button
            onClick={() => handleSwipe('left')}
            variant="outline"
            size="lg"
            className="bg-white/30 hover:bg-white/50 border-2 border-white text-red-500 rounded-full p-4 shadow-xl transform hover:scale-110 transition-transform duration-200"
            aria-label="Pass"
          >
            <X size={32} />
          </Button>
          <Button
            onClick={() => handleSwipe('right')}
            variant="outline"
            size="lg"
            className="bg-white/30 hover:bg-white/50 border-2 border-white text-green-500 rounded-full p-4 shadow-xl transform hover:scale-110 transition-transform duration-200"
            aria-label="Like"
          >
            <Heart size={32} />
          </Button>
        </div>
      )}
      {profiles.length > 0 && currentProfile?.id === 'placeholder' && (
         <div className="mt-8 flex flex-col items-center space-y-4 text-center">
            <HeartCrack size={64} className="text-white/70 mb-4" />
            <p className="text-white text-xl font-semibold">Looks like you've seen everyone for now!</p>
            <p className="text-white/80">Try adjusting your filters in settings or check back later for new sparks.</p>
            <Button onClick={() => navigate('/settings')} className="mt-4 bg-white text-rose-500 hover:bg-rose-100 font-semibold py-3 px-6 rounded-xl shadow-lg">
                <Settings className="mr-2 h-5 w-5" /> Go to Settings
            </Button>
         </div>
      )}
    </div>
  );
};

export default HomePage;