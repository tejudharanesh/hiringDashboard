import React, { useState, useMemo } from "react";
import type { Candidate } from "../types";
import { dummyCandidates, roles } from "../data/candidates";

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "role">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState(false);
  const [sortOrderDropdownOpen, setSortOrderDropdownOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = dummyCandidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.interviewerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesRole =
        selectedRole === "all" || candidate.roleApplied === selectedRole;
      const matchesStatus =
        selectedStatus === "all" || candidate.status === selectedStatus;
      const matchesDate =
        !selectedDate || candidate.interviewDate === selectedDate;

      return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });

    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "date":
          aValue = new Date(a.interviewDate);
          bValue = new Date(b.interviewDate);
          break;
        case "role":
          aValue = a.roleApplied;
          bValue = b.roleApplied;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    searchTerm,
    selectedRole,
    selectedStatus,
    selectedDate,
    sortBy,
    sortOrder,
  ]);

  const statusCounts = useMemo(() => {
    const selected = filteredAndSortedCandidates.filter(
      (c) => c.status === "Selected"
    ).length;
    const rejected = filteredAndSortedCandidates.filter(
      (c) => c.status === "Rejected"
    ).length;
    const onHold = filteredAndSortedCandidates.filter(
      (c) => c.status === "On Hold"
    ).length;

    return {
      selected,
      rejected,
      onHold,
      total: filteredAndSortedCandidates.length,
    };
  }, [filteredAndSortedCandidates]);

  const getStatusBadge = (status: Candidate["status"]) => {
    const variants = {
      Selected: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
      "On Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${variants[status]}`}
      >
        {status}
      </span>
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setSelectedDate("");
  };

  const Dropdown = ({
    isOpen,
    setIsOpen,
    value,
    onSelect,
    options,
    placeholder,
  }: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    value: string;
    onSelect: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
  }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
      >
        <span className={value === "all" ? "text-gray-500" : "text-gray-900"}>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </span>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const roleOptions = [
    { value: "all", label: "All Roles" },
    ...roles.map((role) => ({ value: role, label: role })),
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Selected", label: "Selected" },
    { value: "Rejected", label: "Rejected" },
    { value: "On Hold", label: "On Hold" },
  ];

  const sortByOptions = [
    { value: "name", label: "Name" },
    { value: "date", label: "Date" },
    { value: "role", label: "Role" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">
                  Total
                </p>
                <p className="text-lg sm:text-2xl font-bold text-blue-900">
                  {statusCounts.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs sm:text-sm font-medium">
                  Selected
                </p>
                <p className="text-lg sm:text-2xl font-bold text-green-900">
                  {statusCounts.selected}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-xs sm:text-sm font-medium">
                  Rejected
                </p>
                <p className="text-lg sm:text-2xl font-bold text-red-900">
                  {statusCounts.rejected}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-xs sm:text-sm font-medium">
                  On Hold
                </p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-900">
                  {statusCounts.onHold}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="md:hidden px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {filtersExpanded ? "Hide" : "Show"} Filters
            </button>
          </div>

          <div
            className={`space-y-4 ${
              filtersExpanded ? "block" : "hidden md:block"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Candidates
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name or interviewer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Applied
                </label>
                <Dropdown
                  isOpen={roleDropdownOpen}
                  setIsOpen={setRoleDropdownOpen}
                  value={selectedRole}
                  onSelect={setSelectedRole}
                  options={roleOptions}
                  placeholder="All Roles"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Dropdown
                  isOpen={statusDropdownOpen}
                  setIsOpen={setStatusDropdownOpen}
                  value={selectedStatus}
                  onSelect={setSelectedStatus}
                  options={statusOptions}
                  placeholder="All Status"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg font-semibold">
              Candidates ({statusCounts.total})
            </h2>
          </div>

          <div className="block sm:hidden">
            {filteredAndSortedCandidates.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No candidates found matching your filters.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAndSortedCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {candidate.roleApplied}
                        </p>
                      </div>
                      {getStatusBadge(candidate.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Interview: {candidate.interviewDate}</p>
                      <p>Interviewer: {candidate.interviewerName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Role Applied
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Interview Date
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Interviewer
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      No candidates found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedCandidates.map((candidate, index) => (
                    <tr
                      key={candidate.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="p-3 font-medium text-gray-900">
                        {candidate.name}
                      </td>
                      <td className="p-3 text-gray-600">
                        {candidate.roleApplied}
                      </td>
                      <td className="p-3 text-gray-600">
                        {candidate.interviewDate}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(candidate.status)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {candidate.interviewerName}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
