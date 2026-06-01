import MainLayout from '@/layouts/MainLayout';
import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, Plus, Eye, AlertCircle, MonitorUp, Send, MessageSquare, X } from 'lucide-react';
import { FocusMode } from '../components/FocusMode';
import { supabase } from "@/lib/supabase";

interface Room { id: string; name: string; participants: number; topic: string; isPrivate: boolean; }
interface ChatMessage { sender: string; text: string; time: string; }

const S: React.CSSProperties = {
  background: 'rgba(8,8,18,0.55)',
  border: '1px solid rgba(192,192,220,0.13)',
  borderRadius: '1rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
  backdropFilter: 'blur(18px)',
};

const avatarGrads = [
  'linear-gradient(135deg,#2a2a44 0%,#3a3a5a 100%)',
  'linear-gradient(135deg,#1e2e2e 0%,#2e4040 100%)',
  'linear-gradient(135deg,#2e1e2e 0%,#402e40 100%)',
  'linear-gradient(135deg,#1e1e34 0%,#2e2e50 100%)',
  'linear-gradient(135deg,#2a2418 0%,#403828 100%)',
];

interface StudyRoomType {
  id: string;
  name: string;
  topic: string;
  participants: number;
}

export function StudyRoom() {
  const [inCall, setInCall]               = useState(false);
  const [videoEnabled, setVideoEnabled]   = useState(true);
  const [audioEnabled, setAudioEnabled]   = useState(true);
  const [screenShared, setScreenShared]   = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [selectedRoom, setSelectedRoom]   = useState<Room | null>(null);
  const [chatOpen, setChatOpen]           = useState(true);
  const [chatInput, setChatInput]         = useState('');
  const [messages, setMessages]           = useState<ChatMessage[]>([
    { sender: 'Aman',   text: 'Hey guys! Ready to study Calculus?', time: '11:02 AM' },
    { sender: 'Lisa',   text: 'Struggling with limits, hope you can help!', time: '11:03 AM' },
    { sender: 'System', text: 'Scholar joined the room.', time: '11:04 AM' },
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [studyRooms, setStudyRooms] = useState<StudyRoomType[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomTopic, setRoomTopic] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);


  const sendMsg = () => {
    if (!chatInput.trim()) return;
    setMessages(p => [...p, { sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]);
    setChatInput('');
  };


useEffect(() => {
  fetchRooms();

  const channel = supabase
    .channel("study_rooms_changes")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "study_rooms",
      },

      () => {
        fetchRooms();
      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const ctrlBtn = (active: boolean, danger = false): React.CSSProperties => ({
    padding: '0.85rem',
    borderRadius: '0.75rem',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    border: '1px solid',
    ...(danger && !active
      ? { background: 'rgba(160,50,50,0.18)', borderColor: 'rgba(180,60,60,0.28)', color: '#b07070' }
      : active
        ? { background: 'rgba(160,160,200,0.14)', borderColor: 'rgba(192,192,220,0.22)', color: '#d0d0f0' }
        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(192,192,220,0.10)', color: '#606078' }),
  });

  async function joinRoom(roomId: string, currentCount: number) {
  const { error } = await supabase
    .from("study_rooms")
    .update({
      participants: currentCount + 1,
    })
    .eq("id", roomId);

  if (error) {
    console.error(error);
  } else {
    fetchRooms();
  }
  }

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("study_rooms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRooms(data || []);
    }
  };

  const createRoom = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("study_rooms")
      .insert([
        {
          name: roomName,
          topic: roomTopic,
          created_by: user.id,
          participants: 1,
        },
      ]);

    if (error) {
      console.error(error);
    } else {
      setRoomName("");
      setRoomTopic("");

      fetchRooms();
    }
  };

  if (inCall && selectedRoom) {
    return (
      
      <div className="h-screen flex relative" style={{ background: '#02020c', color: '#f0f0f8' }}>

        {/* Main area */}
        <div className="flex-1 flex flex-col h-full relative">

          {/* Room header */}
          <div className="absolute top-4 left-4 z-10">
            <div className="px-5 py-3 rounded-2xl" style={{ background:'rgba(4,4,14,0.85)', backdropFilter:'blur(16px)', border:'1px solid rgba(192,192,220,0.10)' }}>
              <p style={{ fontSize:'0.85rem', fontWeight:700, color:'#d0d0e8' }}>{selectedRoom.name}</p>
              <p style={{ fontSize:'0.6rem', color:'#44445a', letterSpacing:'0.10em', textTransform:'uppercase', fontWeight:600, marginTop:'2px' }}>
                {selectedRoom.topic} · {selectedRoom.participants + 1} studying
              </p>
            </div>
          </div>

          {focusModeActive && <FocusMode />}

          {/* Participant grid */}
          <div className="flex-1 p-6 grid grid-cols-2 xl:grid-cols-3 gap-5 content-start overflow-y-auto pb-32 pt-20">

            {/* You */}
            <div className="aspect-video rounded-2xl relative overflow-hidden flex items-center justify-center"
              style={{ background:'rgba(6,6,18,0.70)', border:'1px solid rgba(192,192,220,0.10)' }}>
              {videoEnabled ? (
                <div className="w-full h-full flex items-center justify-center" style={{ background:'linear-gradient(135deg,rgba(14,14,28,0.6) 0%,rgba(8,8,20,0.8) 100%)' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background:'linear-gradient(135deg,#2a2a44 0%,#3c3c60 100%)', border:'1.5px solid rgba(192,192,220,0.20)', boxShadow:'0 0 20px rgba(160,160,200,0.12)' }}>
                    <span style={{ fontSize:'1.4rem', fontWeight:700, color:'#d0d0f0' }}>Y</span>
                  </div>
                  {audioEnabled && (
                    <div className="absolute bottom-3 right-3 flex items-end gap-0.5" style={{ height:'14px' }}>
                      {[0.1,0.3,0.5].map((d,i) => (
                        <span key={i} className="w-0.5 lofi-bar rounded-full"
                          style={{ height:`${7+i*3}px`, background:'rgba(160,160,200,0.7)', animationDelay:`${d}s` }} />
                      ))}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full"
                    style={{ background:'radial-gradient(circle,#c0c0d8 0%,#8080a0 100%)', boxShadow:'0 0 6px rgba(180,180,220,0.8)' }} />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <VideoOff className="w-8 h-8" style={{ color:'#303044' }} />
                  <p style={{ fontSize:'0.7rem', color:'#303044', letterSpacing:'0.10em', textTransform:'uppercase' }}>Camera Paused</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background:'rgba(4,4,14,0.85)', border:'1px solid rgba(192,192,220,0.08)', color:'#9090b0' }}>
                You {!audioEnabled && '(Muted)'}
              </div>
            </div>

            {/* Other participants */}
            {Array.from({ length: selectedRoom.participants }).map((_, idx) => (
              <div key={idx} className="aspect-video rounded-2xl relative overflow-hidden flex items-center justify-center"
                style={{ background:'rgba(6,6,18,0.70)', border:'1px solid rgba(192,192,220,0.08)' }}>
                <div className="w-full h-full flex items-center justify-center" style={{ background:'rgba(8,8,20,0.60)' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: avatarGrads[idx % avatarGrads.length], border:'1.5px solid rgba(192,192,220,0.14)' }}>
                    <span style={{ fontSize:'1.4rem', fontWeight:700, color:'#c0c0d8' }}>{String.fromCharCode(65+idx)}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-end gap-0.5" style={{ height:'14px' }}>
                    {[0.2,0.4,0.1].map((d,i) => (
                      <span key={i} className="w-0.5 lofi-bar rounded-full"
                        style={{ height:`${6+i*3}px`, background:'rgba(140,140,180,0.6)', animationDelay:`${d + idx*0.15}s` }} />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background:'rgba(4,4,14,0.85)', border:'1px solid rgba(192,192,220,0.08)', color:'#9090b0' }}>
                  Student {idx + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Control dock */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 p-4 rounded-2xl flex items-center gap-4"
            style={{ background:'rgba(4,4,14,0.90)', backdropFilter:'blur(20px)', border:'1px solid rgba(192,192,220,0.12)', boxShadow:'0 8px 40px rgba(0,0,0,0.6)' }}>

            <button style={ctrlBtn(videoEnabled, true)}  onClick={() => setVideoEnabled(!videoEnabled)}    title={videoEnabled  ? 'Disable Camera'  : 'Enable Camera'}>
              {videoEnabled  ? <Video    className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button style={ctrlBtn(audioEnabled, true)}  onClick={() => setAudioEnabled(!audioEnabled)}   title={audioEnabled  ? 'Mute Mic'         : 'Unmute Mic'}>
              {audioEnabled  ? <Mic      className="w-5 h-5" /> : <MicOff   className="w-5 h-5" />}
            </button>
            <button style={ctrlBtn(focusModeActive)}     onClick={() => setFocusModeActive(!focusModeActive)} title="Super Focus HUD">
              <Eye className="w-5 h-5" />
            </button>
            <button style={ctrlBtn(screenShared)}        onClick={() => setScreenShared(!screenShared)}   title="Share Screen">
              <MonitorUp className="w-5 h-5" />
            </button>
            <button style={ctrlBtn(chatOpen)}            onClick={() => setChatOpen(!chatOpen)}           title="Toggle Chat">
              <MessageSquare className="w-5 h-5" />
            </button>

            <div style={{ width:'1px', height:'24px', background:'rgba(255,255,255,0.08)', margin:'0 4px' }} />

            <button
              onClick={() => { setInCall(false); setSelectedRoom(null); setFocusModeActive(false); }}
              className="px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background:'rgba(160,40,40,0.80)', border:'1px solid rgba(200,60,60,0.30)', color:'#f0d0d0', boxShadow:'0 4px 16px rgba(160,40,40,0.25)' }}
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="w-80 flex flex-col h-full"
            style={{ background:'rgba(4,4,14,0.75)', backdropFilter:'blur(20px)', borderLeft:'1px solid rgba(192,192,220,0.08)' }}>
            <div className="p-4 flex justify-between items-center" style={{ borderBottom:'1px solid rgba(192,192,220,0.07)' }}>
              <h3 style={{ fontSize:'0.85rem' }}>Room Chat</h3>
              <button onClick={() => setChatOpen(false)} style={{ color:'#44445a', padding:'4px' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span style={{ fontSize:'0.72rem', fontWeight:700, color: msg.sender === 'You' ? '#9090b8' : msg.sender === 'System' ? '#607060' : '#808098' }}>
                      {msg.sender}
                    </span>
                    <span style={{ fontSize:'0.6rem', color:'#30304a' }}>{msg.time}</span>
                  </div>
                  <p className="px-3 py-2 rounded-xl" style={{
                    fontSize:'0.78rem', lineHeight:1.5, color:'#9090b0',
                    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.07)',
                  }}>
                    {msg.text}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4" style={{ borderTop:'1px solid rgba(192,192,220,0.07)' }}>
              <div className="flex gap-2">
                <input
                  type="text" placeholder="Send message..." value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  className="flex-1 px-3 py-2.5 rounded-xl outline-none"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.10)', color:'#c0c0d8', fontSize:'0.78rem' }}
                />
                <button onClick={sendMsg}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ background:'rgba(160,160,200,0.14)', border:'1px solid rgba(192,192,220,0.18)', color:'#a0a0c0' }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    );
  }

    
  /* Room lobby */
  return (
    
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <Users className="w-5 h-5" style={{ color:'#7070a0' }} />
          <span style={{ fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:700, color:'#44445a' }}>Social</span>
        </div>
        <h1>Study Rooms</h1>
        <div className="flex gap-4 mb-6">
  <input
    type="text"
    placeholder="Room Name"
    value={roomName}
    onChange={(e) => setRoomName(e.target.value)}
    className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-white"
  />

  <input
    type="text"
    placeholder="Topic"
    value={roomTopic}
    onChange={(e) => setRoomTopic(e.target.value)}
    className="bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-white"
  />

  <button
    onClick={createRoom}
    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
  >
    Create Room
  </button>
</div>
        <p>Join a virtual table to work with friends or fellow scholars.</p>
      </div>


      {/* Focus Mode Banner */}
      <div className="flex items-start gap-4 p-5 mb-8 rounded-2xl"
        style={{ background:'rgba(10,10,22,0.55)', border:'1px solid rgba(192,192,220,0.12)' }}>
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color:'#7070a0' }} />
        <div>
          <p style={{ fontWeight:700, color:'#c0c0d8', fontSize:'0.9rem' }}>Focus Mode HUD Available</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  {room.name}
                </h2>

                <p className="text-gray-400 mb-4">
                  {room.topic}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {room.participants} participants
                  </span>

                  <button
                    onClick={() =>
                      joinRoom(room.id, room.participants)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
                  >
                    Join Room
                  </button>

                </div>
              </div>
            ))}
          </div>
          <p style={{ color:'#44445a', fontSize:'0.78rem', marginTop:'4px', lineHeight:1.6 }}>
            Inside any room, enable the Super Focus tracking widget. The AI engine monitors visual attention via camera and gently alerts when you look away.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="p-6 flex flex-col justify-between h-48 relative overflow-hidden group glass-panel glass-panel-hover">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 style={{ fontSize:'0.95rem' }}>{room.name}</h3>
                <p style={{ fontSize:'0.72rem', color:'#44445a', marginTop:'2px' }}>{room.topic}</p>
              </div>
              {room.isPrivate && (
                <span style={{ fontSize:'0.6rem', color:'#44445a', background:'rgba(255,255,255,0.04)', padding:'2px 8px', borderRadius:'4px', border:'1px solid rgba(192,192,220,0.08)' }}>Private</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 my-4" style={{ fontSize:'0.78rem', color:'#50506a' }}>
              <Users className="w-4 h-4" style={{ color:'#6060a0' }} />
              <span>{room.participants} studying now</span>
            </div>

            <button
              onClick={() => { setSelectedRoom(room); setInCall(true); }}
              className="w-full py-3 rounded-xl text-xs font-bold transition-all duration-300"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.12)', color:'#8080a8' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(160,160,200,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#d0d0f0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = '#8080a8'; }}
            >
              Join Call
            </button>
          </div>
        ))}
      </div>
    </div>
  
  );
}
