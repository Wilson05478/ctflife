
import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar as CalendarIcon,
  Zap,
  ChevronRight,
} from 'lucide-react';

import { BottomNav, Header } from './components/Layout';
import { 
  View, 
  User, 
  RewardItem, 
  EventItem, 
} from './types';

// The Router Part
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Learn from './pages/Learn';
import axios from 'axios';
import { setAuthToken } from './api';

// --- MOCK DATA ---
export const INITIAL_USER: User = {
  username: 'Student123',
  email: 'student@ctflife.com',
  kDollars: 50,
  streakDays: 4,
  badges: ['Early Adopter'],
  interests: ['Video Games'],
  language: 'English',
  savingsGoal: {
    amount: 1000,
    targetDate: '2024-12-31',
    current: 350
  },
  level: 4,
};

const MOCK_REWARDS: RewardItem[] = [
  { id: 'r1', name: 'Giordano $50 Coupon', cost: 100, image: 'https://picsum.photos/200/200', description: 'Valid for any purchase over $200.' },
  { id: 'r2', name: 'K11 Art Mall Coffee', cost: 40, image: 'https://picsum.photos/201/200', description: 'Free coffee at participating cafes.' },
  { id: 'r3', name: 'Movie Ticket Voucher', cost: 150, image: 'https://picsum.photos/202/200', description: 'One standard ticket at MCL Cinemas.' },
];

const MOCK_EVENTS: EventItem[] = [
  { id: 'e1', name: 'Financial Freedom Workshop', date: 'Oct 25, 2024', location: 'K11 Atelier', type: 'Workshop', spotsAvailable: 12, isRegistered: false },
  { id: 'e2', name: '施傅教學 - 入門理財班', date: 'Nov 02, 2024', location: 'CTF Center', type: 'Class', spotsAvailable: 5, isRegistered: false, price: 'FREE' },
  { id: 'e3', name: 'Gaming Assets Investment', date: 'Nov 15, 2024', location: 'Virtual', type: 'Featured', spotsAvailable: 100, isRegistered: false },
];

export default function App() {
  const [view, setView] = useState<View>(View.LOGIN);

  const toggleView = (newView: View) => {
    setView(newView);
  };

  const [user, setUser] = useState<User>(INITIAL_USER);
  const [events] = useState<EventItem[]>(MOCK_EVENTS);
  const [showNotification, setShowNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Authentication & Customization State
  const [loginForm, setLoginForm] = useState({email: '' ,password: ''});

  const toggleLoginForm = (type: string, value: any) => {
    if (type === 'password') {
      setLoginForm(prev => ({...prev, password: value}));
    }
    else if (type === 'email') {
      setLoginForm(prev => ({...prev, email: value}));
    }
  }

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setShowNotification({ msg, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      notify("Please fill in credentials", "error");
      return;
    }
    try{
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', loginForm.email);
      params.append('password', loginForm.password);
      // If needed, add:
      // params.append('scope', '');
      // params.append('client_id', '');
      // params.append('client_secret', '');
      const response = await axios.post("/auth/token", params); 
      const token = response.data;
      setAuthToken(token.access_token);
      notify('User Logged In Successfully', 'success');
      toggleView(View.HOME);
      // setUser({ ...INITIAL_USER, username: data.username });
      setView(View.HOME);
    } catch(error){
      console.error("Error occurred when logging in ", error);
      notify('Login failed. Please try again.', 'error');
    }
  };

  // Added missing RewardsView implementation
  const RewardsView = () => (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Rewards</h2>
        <div className="text-[10px] bg-teal-50 text-teal-700 px-2 py-1 rounded-full border border-teal-100 uppercase tracking-tighter font-black">
          {user.kDollars} K$ Available
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_REWARDS.map(reward => (
          <div key={reward.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex gap-4 items-center">
            <img src={reward.image} alt={reward.name} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm lg:text-base">{reward.name}</h4>
              <p className="text-xs lg:text-sm text-gray-500 mb-2">{reward.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-teal-600 font-black text-sm lg:text-base">{reward.cost} K$</span>
                <button 
                  onClick={() => {
                    if (user.kDollars >= reward.cost) {
                      setUser(prev => ({ ...prev, kDollars: prev.kDollars - reward.cost }));
                      notify(`Redeemed ${reward.name}!`);
                    } else {
                      notify("Not enough K Dollars", "error");
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition ${user.kDollars >= reward.cost ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EventsView = () => (
    <div className="p-4 pb-24 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Events & Classes</h2>
        <p className="text-sm lg:text-base text-gray-500">Join offline workshops and earn badges.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs lg:text-sm font-black text-orange-500 uppercase tracking-widest">Featured Classes (Ad)</h3>
        {events.filter(e => e.type === 'Class').map(event => (
          <div key={event.id} className="bg-orange-50 border border-orange-200 p-5 rounded-3xl relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h4 className="font-black text-orange-800 text-xl lg:text-2xl">{event.name}</h4>
                <p className="text-orange-600 text-sm lg:text-base mt-1">{event.location} • {event.date}</p>
                <button className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-xl text-xs lg:text-sm font-black shadow-lg shadow-orange-600/20">Register for {event.price}</button>
              </div>
              <Zap className="text-orange-200" size={60} />
            </div>
          </div>
        ))}

        <h3 className="text-xs lg:text-sm font-black text-gray-400 uppercase tracking-widest mt-8">Upcoming Workshops</h3>
        {events.filter(e => e.type !== 'Class').map(event => (
          <div key={event.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-teal-500 transition">
             <div>
                <h4 className="font-bold text-slate-800">{event.name}</h4>
                <div className="flex gap-3 text-xs lg:text-sm text-gray-400 mt-2 font-medium">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                  <span className="flex items-center gap-1"><CalendarIcon size={12} /> {event.date}</span>
                </div>
             </div>
             <ChevronRight className="text-gray-300 group-hover:text-teal-600 transition" />
          </div>
        ))}
      </div>
    </div>
  );

  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {view !== View.LOGIN && view !== View.REGISTER && <Header username={user.username} kDollars={user.kDollars} onLogout={() => setView(View.LOGIN)} />}
      <main className="max-w mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden">
        {view === View.LOGIN && <Login loginForm={loginForm} View={View} toggleView={toggleView} handleLogin={handleLogin} toggleLogInForm={toggleLoginForm} />}
        {view === View.REGISTER && <Register View={View} toggleView={toggleView} notify={notify} />}
        {view === View.HOME && <Home user={user} eventNum = {MOCK_EVENTS.length} View={View} setView={toggleView} />}
        {view === View.LEARN && <Learn  notify={notify} />}
        {view === View.REWARDS && <RewardsView />}
        {view === View.EVENTS && <EventsView />}
      </main>
      {view !== View.LOGIN && view !== View.REGISTER && <BottomNav currentView={view} onChangeView={setView} onLogout={() => setView(View.LOGIN)} />}
      {showNotification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[300] text-white font-black text-xs animate-bounce ${showNotification.type === 'error' ? 'bg-red-500' : 'bg-teal-600'}`}>
          {showNotification.msg}
        </div>
      )}
    </div>
  );
}
