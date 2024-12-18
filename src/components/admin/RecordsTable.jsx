import React from 'react';
import { Edit, Trash2, Search, Plus } from 'lucide-react';

const RecordsTable = ({
  records,
  genres,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  setIsAddModalOpen
}) => {
    const getGenreName = (genreId) => {
      const genre = genres?.find(g => g.id === parseInt(genreId));
      return genre ? genre.name : 'N/A';
    };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border-4 border-black p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-black text-white p-2 flex items-center justify-center space-x-2"
        >
          <Plus /> <span>Add New Records</span>
        </button>
      </div>

      <div className="bg-white border-8 border-black p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-4 border-black">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Artist</th>
                <th className="p-2 text-left">Genre</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records
                .filter(record => 
                  record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  record.artist.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(record => (
                  <tr key={record.id} className="border-b-2 border-black">
                    <td className="p-2">{record.title}</td>
                    <td className="p-2">{record.artist}</td>
                    <td className="p-2">{getGenreName(record.genreId)}</td>
                    <td className="p-2">€{record.price}</td>
                    <td className="p-2">{record.year || 'N/A'}</td>  
                    <td className="p-2">{record.quantity}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(record)}
                          className="p-1 bg-blue-600 text-white"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(record.id)}
                          className="p-1 bg-red-600 text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default RecordsTable;