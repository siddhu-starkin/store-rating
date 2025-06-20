import { useState, useMemo, useEffect } from "react";
//USAGE:
// const {
//   paginatedData,
//   filteredData,
//   selectedRows,
//   currentPage,
//   totalPages,
//   goToPage,
//   searchTerm,
//   setSearchTerm,
//   toggleRowSelection,
//   startDate,
//   endDate,
//   setStartDate,
// } = useDataManager(dummyData, config);
const useDataManager = (
  rawData = [],
  config = {
    dateKey: "createdAt",
    searchKey: "name",
    rowsPerPageDefault: 10,
    selectionKey: "_id",
  }
) => {
  const { dateKey, searchKey, rowsPerPageDefault, selectionKey } = config;

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Ensure rawData is an array
  const safeRawData = useMemo(() => {
    return Array.isArray(rawData) ? rawData : [];
  }, [rawData]);

  // Filter by search
  const searchFiltered = useMemo(() => {
    if (!searchTerm) return safeRawData;
    return safeRawData.filter((item) => {
      const searchValue = item[searchKey];
      return (
        searchValue &&
        typeof searchValue === "string" &&
        searchValue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [safeRawData, searchTerm, searchKey]);

  // Filter by date
  const dateFiltered = useMemo(() => {
    if (!startDate || !endDate) return searchFiltered;

    // Normalize dates to ignore time part
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return searchFiltered.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      return !isNaN(itemDate.getTime()) && itemDate >= start && itemDate <= end;
    });
  }, [searchFiltered, startDate, endDate, dateKey]);

  // Reset currentPage to 1 when filtered data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, safeRawData]);

  // Total pages for pagination
  const totalPages = Math.max(
    1,
    Math.ceil((dateFiltered?.length || 0) / rowsPerPage)
  );

  // Paginated visible data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return dateFiltered.slice(start, start + rowsPerPage);
  }, [dateFiltered, currentPage, rowsPerPage]);

  // Selected rows (by ID)
  const selectedRows = useMemo(() => {
    return dateFiltered.filter((item) => selectedIds.has(item[selectionKey]));
  }, [dateFiltered, selectedIds, selectionKey]);

  // Toggle row selection
  const toggleRowSelection = (row) => {
    if (!row || !row[selectionKey]) return;

    const id = row[selectionKey];
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Change page manually with bounds check
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    paginatedData,
    filteredData: dateFiltered,
    selectedRows,

    // pagination controls
    currentPage,
    totalPages,
    setRowsPerPage,
    goToPage,

    // filters
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    searchTerm,
    setSearchTerm,

    // selection
    selectedIds,
    toggleRowSelection,
    setSelectedIds,
  };
};

export default useDataManager;
