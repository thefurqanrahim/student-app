"use client";

interface SortProps {
  setSortType: (sortType: string) => void;
  sortType: string;
}

export default function Sort({ setSortType, sortType }: SortProps) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  };

  const handleClearSort = () => {
    setSortType(''); 
  };

  return (
    <div className="mb-4 p-4 bg-white rounded shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Sort By</h3>
      <select onChange={handleSortChange} className="border rounded p-2 w-full mb-4">
        <option value="">Select Sort Option</option>
        <option value="lowToHigh">Lowest Price</option>
        <option value="highToLow">Highest Price</option>
        <option value="deadline">Deadline</option>
      </select>

      {sortType && (
        <button
          onClick={handleClearSort}
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Sort
        </button>
      )}
    </div>
  );
}
