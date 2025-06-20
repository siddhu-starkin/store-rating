export function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based month
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function MappingStyles(value) {
  const styleMap = {
    Ongoing: "bg-[#ccffcc] text-green-700 border border-green-700",
    Upcoming: "bg-[#ffffcc] text-yellow-700 border border-yellow-700",
    Cancelled: "bg-[#ffe6e6] text-red-700 border border-red-700",
    Pending: "bg-[#FFFFCC] text-[#A7A700]",
    Approved: "bg-[#ccffcc] text-green-700 border border-green-700",
    Rejected: "bg-[#ffe6e6] text-red-700 border border-red-700",
    Admin: "bg-[#E6CCE6] text-[#800080] border border-[#800080]",
    Subadmin: "bg-[#FFDAF1] text-[#FF46BA] border border-[#FF46BA]",
    Staff: "bg-[#FFA50033]/20 text-[#AC5300] border border-[#AC5300]",
  };
  return styleMap[value] || "text-black bg-white";
}
export function convertDecimalToTime(decimalHours) {
  const totalMinutes = Math.floor(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60) || 0;
  const minutes = totalMinutes % 60 || 0;
  return `${hours} hr ${minutes} min`;
}

export const formatElapsed = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
};

export function formatDateDetailed(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);

  // const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // const day = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const getOrdinalSuffix = (n) => {
    if (n > 3 && n < 21) return `${n}th`;
    switch (n % 10) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  };

  return `${getOrdinalSuffix(dayOfMonth)} ${month}, ${year}`;
}

export function formatTime(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours}:${minutes} ${ampm}`;
}

export function formatDurationFromMinutes(totalMinutes) {
  if (
    totalMinutes === null ||
    totalMinutes === undefined ||
    isNaN(totalMinutes) ||
    totalMinutes < 0
  ) {
    return "0 min";
  }
  if (totalMinutes === 0) {
    return "0 min";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours > 0 ? `${hours} hr ` : ""}${minutes} min`;
}
