import { useState } from 'react';
import { Book, Search, Download, BookOpen, Star, Filter } from 'lucide-react';

interface EBook {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  rating: number;
  coverColor: string;
  progress?: number;
}

export function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Literature'];

  const ebooks: EBook[] = [
    { id: '1', title: 'Calculus: Early Transcendentals', author: 'James Stewart', category: 'Mathematics', pages: 1368, rating: 4.5, coverColor: 'from-blue-500 to-blue-700', progress: 45 },
    { id: '2', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', pages: 1312, rating: 4.8, coverColor: 'from-green-500 to-green-700', progress: 23 },
    { id: '3', title: 'Physics for Scientists and Engineers', author: 'Raymond A. Serway', category: 'Physics', pages: 1280, rating: 4.6, coverColor: 'from-purple-500 to-purple-700' },
    { id: '4', title: 'Organic Chemistry', author: 'Paula Yurkanis Bruice', category: 'Chemistry', pages: 1328, rating: 4.4, coverColor: 'from-pink-500 to-pink-700', progress: 67 },
    { id: '5', title: 'Campbell Biology', author: 'Jane B. Reece', category: 'Biology', pages: 1488, rating: 4.7, coverColor: 'from-teal-500 to-teal-700' },
    { id: '6', title: 'Linear Algebra and Its Applications', author: 'David C. Lay', category: 'Mathematics', pages: 576, rating: 4.3, coverColor: 'from-indigo-500 to-indigo-700', progress: 89 },
    { id: '7', title: 'The Feynman Lectures on Physics', author: 'Richard P. Feynman', category: 'Physics', pages: 1552, rating: 4.9, coverColor: 'from-orange-500 to-orange-700' },
    { id: '8', title: 'Data Structures and Algorithm Analysis', author: 'Mark Allen Weiss', category: 'Computer Science', pages: 592, rating: 4.5, coverColor: 'from-cyan-500 to-cyan-700' },
  ];

  const filteredBooks = ebooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentlyReading = ebooks.filter((book) => book.progress && book.progress > 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>E-Library</h1>
        <p className="text-gray-600 mt-2">Access your digital collection of books and resources</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl mb-4">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentlyReading.map((book) => (
              <div key={book.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className={`w-20 h-28 bg-gradient-to-br ${book.coverColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Book className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 line-clamp-2">{book.title}</p>
                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-purple-600">{book.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Continue Reading
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Books */}
      <div>
        <h2 className="text-xl mb-4">All Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className={`w-full h-48 bg-gradient-to-br ${book.coverColor} rounded-lg flex items-center justify-center mb-4`}>
                <Book className="w-16 h-16 text-white" />
              </div>
              
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2">
                {book.category}
              </span>
              
              <p className="mb-1 line-clamp-2">{book.title}</p>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{book.rating}</span>
                <span className="text-sm text-gray-500">· {book.pages} pages</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Read
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No books found matching your search</p>
        </div>
      )}
    </div>
  );
}
