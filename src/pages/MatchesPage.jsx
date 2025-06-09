
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, HeartCrack, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const MatchesPage = () => {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [negativeChats, setNegativeChats] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const storedMatches = JSON.parse(localStorage.getItem(`matches_${currentUser.id}`)) || [];
      setMatches(storedMatches);
      const storedNegativeChats = JSON.parse(localStorage.getItem(`negativeChats_${currentUser.id}`)) || [];
      setNegativeChats(storedNegativeChats);
    }
  }, [currentUser]);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.map(part => part[0]).join('').toUpperCase();
  };

  const MatchItem = ({ profile, type }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/chat/${type}-${profile.id}`} className="block hover:bg-pink-50 rounded-lg transition-colors">
        <Card className="border-transparent shadow-none hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-pink-200">
              <AvatarImage src={profile.images && profile.images[0]} alt={profile.name} />
              <AvatarFallback className="bg-pink-100 text-pink-600 font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold text-gray-800">{profile.name.split(',')[0]}</p>
              <p className="text-sm text-gray-500 truncate">
                {type === 'match' ? "You matched! Start chatting." : "You both passed. Curious?"}
              </p>
            </div>
            <MessageSquare className="w-5 h-5 text-pink-400" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-xl bg-white/90 backdrop-blur-lg border-pink-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-pink-600">Your Connections</CardTitle>
          <CardDescription className="text-gray-600">See who you've matched with and... who you haven't!</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-pink-100 rounded-lg p-1">
              <TabsTrigger value="matches" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md py-2 transition-all">
                <HeartCrack className="w-4 h-4 mr-2 inline-block transform rotate-180 text-green-500 data-[state=active]:text-white" /> Matches ({matches.length})
              </TabsTrigger>
              <TabsTrigger value="negative-chats" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md py-2 transition-all">
                <HeartCrack className="w-4 h-4 mr-2 inline-block text-red-500 data-[state=active]:text-white" /> Negative Chats ({negativeChats.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="matches" className="mt-6 space-y-3">
              {matches.length > 0 ? (
                matches.map(profile => <MatchItem key={`match-${profile.id}`} profile={profile} type="match" />)
              ) : (
                <div className="text-center py-10">
                  <UserCircle2 className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                  <p className="text-gray-500">No matches yet. Keep swiping!</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="negative-chats" className="mt-6 space-y-3">
              {negativeChats.length > 0 ? (
                negativeChats.map(profile => <MatchItem key={`neg-${profile.id}`} profile={profile} type="negative" />)
              ) : (
                <div className="text-center py-10">
                  <UserCircle2 className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <p className="text-gray-500">No 'negative chats' yet. An interesting void!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchesPage;
