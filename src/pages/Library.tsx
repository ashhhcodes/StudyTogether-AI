import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { BookOpen, Search, Plus, BookMarked, ArrowUpRight } from 'lucide-react';

interface Book {
  id: string; title: string; author: string; category: string;
  progress: number; pages: number; coverGrad: string;
}

const P: React.CSSProperties = {
  background: 'rgba(8,8,18,0.55)', border: '1px solid rgba(192,192,220,0.13)',
  borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
  backdropFilter: 'blur(18px)',
};

export function Library() {
  const [searchTerm,      setSearchTerm]      = useState('');
  const [activeCategory,  setActiveCategory]  = useState('All');
  const [showModal,       setShowModal]        = useState(false);
  const [newTitle,        setNewTitle]         = useState('');
  const [newAuthor,       setNewAuthor]        = useState('');
  const [newCat,          setNewCat]           = useState('Mathematics');

  const [books, setBooks] = useState<Book[]>([
    { id:'1', title:"Thomas' Calculus (14th Ed.)",          author:'George B. Thomas',  category:'Mathematics',      progress:45,  pages:1210, coverGrad:'linear-gradient(135deg,#141424 0%,#1e1e38 100%)' },
    { id:'2', title:'University Physics w/ Modern Physics', author:'Hugh D. Young',     category:'Physics',          progress:12,  pages:1600, coverGrad:'linear-gradient(135deg,#101820 0%,#182030 100%)' },
    { id:'3', title:'Organic Chemistry Study Guide',        author:'David R. Klein',    category:'Chemistry',        progress:78,  pages:840,  coverGrad:'linear-gradient(135deg,#101a14 0%,#182418 100%)' },
    { id:'4', title:'Introduction to Algorithms',           author:'Thomas H. Cormen',  category:'Computer Science', progress:28,  pages:1312, coverGrad:'linear-gradient(135deg,#1a1018 0%,#281620 100%)' },
    { id:'5', title:'Linear Algebra and Its Applications',  author:'David C. Lay',      category:'Mathematics',      progress:95,  pages:576,  coverGrad:'linear-gradient(135deg,#0e0e1e 0%,#181828 100%)' },
    { id:'6', title:'A Brief History of Time',              author:'Stephen Hawking',   category:'Physics',          progress:100, pages:212,  coverGrad:'linear-gradient(135deg,#180e0e 0%,#241414 100%)' },
  ]);

  const categories = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'];

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = activeCategory === 'All' || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleUpload = () => {
    if (!newTitle.trim() || !newAuthor.trim()) return;
    const grads = [
      'linear-gradient(135deg,#141424 0%,#1e1e38 100%)',
      'linear-gradient(135deg,#101820 0%,#182030 100%)',
      'linear-gradient(135deg,#101a14 0%,#182418 100%)',
      'linear-gradient(135deg,#1a1018 0%,#281620 100%)',
    ];
    setBooks(prev => [{
      id: Date.now().toString(), title: newTitle, author: newAuthor, category: newCat,
      progress: 0, pages: Math.floor(Math.random()*400)+200,
      coverGrad: grads[Math.floor(Math.random()*grads.length)],
    }, ...prev]);
    setNewTitle(''); setNewAuthor(''); setShowModal(false);
  };

  const inputCls: React.CSSProperties = {
    width:'100%', padding:'0.7rem 1rem',
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.12)',
    borderRadius:'0.75rem', color:'#c8c8e0', fontSize:'0.82rem', outline:'none',
  };

  return (
    
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen className="w-5 h-5" style={{ color:'#7070a0' }} />
            <span style={{ fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:700, color:'#44445a' }}>Resources</span>
          </div>
          <h1>E-Library</h1>
          <p>Access text guides, resources, and track your reading progress.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-5 h-5" /> Add Resource
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl justify-between"
        style={{ background:'rgba(6,6,16,0.50)', border:'1px solid rgba(192,192,220,0.09)' }}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#404055' }} />
          <input
            type="text" placeholder="Search books, authors..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.10)', color:'#c0c0d8', fontSize:'0.8rem' }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 text-xs rounded-xl whitespace-nowrap transition-all duration-200 font-semibold"
              style={activeCategory === cat
                ? { background:'rgba(160,160,200,0.16)', color:'#d0d0f0', border:'1px solid rgba(192,192,220,0.22)' }
                : { background:'rgba(255,255,255,0.04)', color:'#44445a', border:'1px solid rgba(192,192,220,0.07)' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(book => (
          <div key={book.id} className="p-4 flex flex-col justify-between group" style={{ ...P, height:'360px' }}>

            {/* Book cover */}
            <div className="h-40 w-full rounded-xl p-4 flex flex-col justify-between relative overflow-hidden"
              style={{ background: book.coverGrad, border:'1px solid rgba(192,192,220,0.10)' }}>
              {/* Spine line */}
              <div className="absolute top-0 bottom-0 left-3 w-0.5" style={{ background:'rgba(0,0,0,0.30)' }} />
              {/* Subtle star dots on cover */}
              <div className="absolute top-3 right-4 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
              <div className="absolute top-7 right-8 w-1   h-1   bg-white rounded-full opacity-20" />

              <div className="flex justify-between items-start">
                <BookMarked className="w-5 h-5" style={{ color:'rgba(192,192,220,0.35)' }} />
                <span style={{ fontSize:'0.6rem', background:'rgba(0,0,0,0.45)', color:'rgba(192,192,220,0.70)',
                  padding:'2px 8px', borderRadius:'9999px', border:'1px solid rgba(192,192,220,0.12)', fontWeight:600, letterSpacing:'0.06em' }}>
                  {book.category}
                </span>
              </div>

              <div className="mt-auto">
                <p style={{ fontSize:'0.82rem', fontWeight:700, color:'rgba(220,220,240,0.90)', lineHeight:1.3 }} className="truncate">
                  {book.title}
                </p>
                <p style={{ fontSize:'0.65rem', color:'rgba(180,180,200,0.55)', fontStyle:'italic', marginTop:'2px' }} className="truncate">
                  {book.author}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 flex flex-col justify-between mt-4">
              <div>
                <p style={{ fontSize:'0.65rem', color:'#44445a', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>Reading Progress</p>
                <div className="flex justify-between items-center mt-2" style={{ fontSize:'0.78rem' }}>
                  <span style={{ color:'#8080a0' }}>Progress</span>
                  <span style={{ fontWeight:700, fontFamily:'var(--font-mono)', color: book.progress === 100 ? '#80b890' : '#9090c0' }}>
                    {book.progress}%
                  </span>
                </div>
                <div className="w-full rounded-full h-1.5 mt-1.5" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(192,192,220,0.06)' }}>
                  <div className="h-1.5 rounded-full transition-all"
                    style={{
                      width:`${book.progress}%`,
                      background: book.progress === 100
                        ? 'linear-gradient(90deg,#608060 0%,#80b080 100%)'
                        : 'linear-gradient(90deg,#606090 0%,#9090c0 100%)',
                      boxShadow: book.progress === 100 ? '0 0 6px rgba(100,160,100,0.30)' : '0 0 6px rgba(130,130,190,0.25)',
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 mt-4" style={{ borderTop:'1px solid rgba(192,192,220,0.07)' }}>
                <span style={{ fontSize:'0.65rem', color:'#38384a', fontWeight:600, textTransform:'uppercase' }}>{book.pages} Pages</span>
                <button className="flex items-center gap-0.5 transition-colors" style={{ fontSize:'0.72rem', color:'#7070a0', fontWeight:700 }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#b0b0d0'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#7070a0'}>
                  <span>Open Resource</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ background:'rgba(6,6,16,0.35)', border:'1px solid rgba(192,192,220,0.07)' }}>
          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color:'#202030', opacity:0.6 }} />
          <p style={{ color:'#44445a' }}>No books found in this category.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.70)', backdropFilter:'blur(6px)' }}>
          <div className="w-full max-w-md p-6 rounded-2xl relative" style={{ background:'#080814', border:'1px solid rgba(192,192,220,0.14)', boxShadow:'0 24px 60px rgba(0,0,0,0.8)' }}>
            <h3 style={{ marginBottom:'1.25rem' }}>Add Digital Resource</h3>

            <div className="space-y-4">
              {[
                { label:'Book Title',  val:newTitle,  set:setNewTitle,  ph:'e.g. Introduction to Electrodynamics' },
                { label:'Author',      val:newAuthor, set:setNewAuthor, ph:'e.g. David J. Griffiths'              },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display:'block', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', color:'#44445a', marginBottom:'6px' }}>
                    {f.label}
                  </label>
                  <input type="text" placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={inputCls} />
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', color:'#44445a', marginBottom:'6px' }}>
                  Category
                </label>
                <select value={newCat} onChange={e => setNewCat(e.target.value)}
                  style={{ ...inputCls, background:'#0a0a18' }}>
                  {['Mathematics','Physics','Chemistry','Computer Science'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleUpload} className="btn-primary text-xs">Upload Resource</button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}
